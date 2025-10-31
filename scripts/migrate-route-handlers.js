#!/usr/bin/env node

/**
 * Migrate Next.js route handlers to Next.js 16 async params API
 *
 * Next.js 16 changed route handlers to use async params:
 * Before: ({ params }: { params: { id: string } })
 * After:  ({ params }: { params: Promise<{ id: string }> })
 *
 * And usage changes from `params.id` to `(await params).id`
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

// Find all route.ts files in app/api with dynamic segments
const routeFiles = [
  'app/api/loyalty-levels/[id]/route.ts',
  'app/api/clients/[id]/route.ts',
  'app/api/categories/[id]/route.ts',
  'app/api/categories/[id]/champs/route.ts',
  'app/api/articles/[id]/route.ts',
  'app/api/stock/mouvements/[id]/route.ts',
  'app/api/documents/[id]/route.ts',
  'app/api/categories/[id]/champs/[champId]/route.ts',
  'app/api/articles/[id]/stock/route.ts',
].map(f => path.join(__dirname, '..', f));

let totalChanges = 0;

routeFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Skipping ${filePath} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Step 1: Update type signatures for params
  // Pattern: { params }: { params: { id: string } }
  // Replace with: { params }: { params: Promise<{ id: string }> }
  content = content.replace(
    /\{ params \}: \{ params: (\{[^}]+\}) \}/g,
    '{ params }: { params: Promise<$1> }'
  );

  // Step 2: Update params usage to await params
  // Pattern: params.id or params.champId
  // Replace with: (await params).id or (await params).champId
  // But only if not already wrapped in await
  content = content.replace(
    /(?<!await )\bparams\.(\w+)/g,
    '(await params).$1'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${path.relative(process.cwd(), filePath)}`);
    totalChanges++;
  } else {
    console.log(`  No changes needed for ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`\n✓ Migration complete! Updated ${totalChanges} file(s).`);
