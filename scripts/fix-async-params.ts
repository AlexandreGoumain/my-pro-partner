import fs from 'fs';
import { glob } from 'glob';

/**
 * Script pour corriger les routes API Next.js 16
 * Les params sont maintenant des Promise et doivent être awaités
 */

async function fixRouteFile(filePath: string): Promise<void> {
  const content = fs.readFileSync(filePath, 'utf-8');
  let modified = content;
  let hasChanges = false;

  // Pattern pour détecter les fonctions de route avec params non-async
  const routeHandlerPattern = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(\s*([^,]+),\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{([^}]+)\}\s*\}/g;

  const matches = [...content.matchAll(routeHandlerPattern)];

  if (matches.length === 0) {
    return; // Pas de params à corriger
  }

  for (const match of matches) {
    const method = match[1];
    const reqParam = match[2].trim();
    const paramsType = match[3].trim();

    // Nouvelle signature avec Promise
    const oldSignature = `export async function ${method}(\n    ${reqParam},\n    { params }: { params: { ${paramsType} } }`;
    const newSignature = `export async function ${method}(\n    ${reqParam},\n    { params }: { params: Promise<{ ${paramsType} }> }`;

    if (modified.includes(oldSignature)) {
      modified = modified.replace(oldSignature, newSignature);
      hasChanges = true;

      // Trouver le début de la fonction et ajouter l'await params
      const functionStart = modified.indexOf(newSignature);
      const openBraceIndex = modified.indexOf('{', functionStart + newSignature.length);
      const firstLineAfterBrace = modified.indexOf('\n', openBraceIndex);

      // Extraire les noms des paramètres
      const paramNames = paramsType.split(',').map(p => p.split(':')[0].trim());
      const destructuring = paramNames.length === 1
        ? `const { ${paramNames[0]} } = await params;`
        : `const { ${paramNames.join(', ')} } = await params;`;

      // Insérer l'await après l'ouverture de la fonction
      const beforeInsert = modified.substring(0, firstLineAfterBrace + 1);
      const afterInsert = modified.substring(firstLineAfterBrace + 1);

      // Vérifier si l'await n'existe pas déjà
      if (!afterInsert.trim().startsWith('const') || !afterInsert.includes('await params')) {
        modified = beforeInsert + `    ${destructuring}\n` + afterInsert;
      }

      // Remplacer params.xxx par xxx (seulement dans le corps de la fonction)
      for (const paramName of paramNames) {
        const paramUsageRegex = new RegExp(`params\\.${paramName}\\b`, 'g');
        modified = modified.replace(paramUsageRegex, paramName);
      }
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
  }
}

async function main() {
  const routeFiles = await glob('app/api/**/[*]/route.ts', {
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`Found ${routeFiles.length} route files to check...`);

  for (const file of routeFiles) {
    try {
      await fixRouteFile(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log('\n✓ Done!');
}

main().catch(console.error);
