#!/usr/bin/env tsx
// ============================================
// REDIS CONNECTION TEST
// ============================================

/**
 * Script pour tester la connexion à Upstash Redis
 *
 * Usage:
 *   npx tsx scripts/test-redis-connection.ts
 */

import { Redis } from "@upstash/redis";
import { isRedisAvailable } from "../lib/chatbot/security/rate-limit";

// Couleurs console
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};

function success(msg: string) {
    console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg: string) {
    console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function info(msg: string) {
    console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`);
}

function section(title: string) {
    console.log(`\n${colors.cyan}${"=".repeat(60)}`);
    console.log(`${title}`);
    console.log(`${"=".repeat(60)}${colors.reset}\n`);
}

async function main() {
    console.clear();
    console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🔌 UPSTASH REDIS CONNECTION TEST 🔌                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}
`);

    // ============================================
    // TEST 1: Variables d'environnement
    // ============================================

    section("TEST 1: Variables d'environnement");

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || url === "") {
        error("UPSTASH_REDIS_REST_URL n'est pas défini dans .env");
        console.log(`\n${colors.yellow}⚠️  Action requise:${colors.reset}`);
        console.log(`1. Aller sur https://console.upstash.com/redis`);
        console.log(`2. Créer une database Redis`);
        console.log(`3. Copier l'URL REST dans .env`);
        console.log(`\nExemple dans .env:`);
        console.log(
            `UPSTASH_REDIS_REST_URL="https://eu2-proven-mantis-12345.upstash.io"\n`
        );
        process.exit(1);
    }

    if (!token || token === "") {
        error("UPSTASH_REDIS_REST_TOKEN n'est pas défini dans .env");
        console.log(`\n${colors.yellow}⚠️  Action requise:${colors.reset}`);
        console.log(`1. Aller sur https://console.upstash.com/redis`);
        console.log(`2. Copier le token REST dans .env`);
        console.log(`\nExemple dans .env:`);
        console.log(`UPSTASH_REDIS_REST_TOKEN="AYQgASQgMTUw..."\n`);
        process.exit(1);
    }

    success("Variables d'environnement trouvées");
    info(`URL: ${url.substring(0, 30)}...`);
    info(`Token: ${token.substring(0, 20)}...`);

    // ============================================
    // TEST 2: Connexion basique
    // ============================================

    section("TEST 2: Connexion basique (PING)");

    const redis = new Redis({
        url,
        token,
    });

    try {
        const result = await redis.ping();
        if (result === "PONG") {
            success("PING réussi - Redis répond correctement");
        } else {
            error(`PING a répondu: ${result} (attendu: PONG)`);
        }
    } catch (err) {
        error("Échec de connexion à Redis");
        console.log(`\nErreur: ${(err as Error).message}`);
        console.log(`\n${colors.yellow}⚠️  Vérifications:${colors.reset}`);
        console.log(`1. URL correcte dans .env ?`);
        console.log(`2. Token correct dans .env ?`);
        console.log(`3. Pas d'espaces ou de \\n dans les valeurs ?`);
        console.log(`4. Database active sur Upstash ?`);
        process.exit(1);
    }

    // ============================================
    // TEST 3: Fonction isRedisAvailable()
    // ============================================

    section("TEST 3: Fonction isRedisAvailable()");

    try {
        const available = await isRedisAvailable();
        if (available) {
            success("isRedisAvailable() retourne true");
        } else {
            error("isRedisAvailable() retourne false");
        }
    } catch (err) {
        error(
            `isRedisAvailable() a levé une erreur: ${(err as Error).message}`
        );
    }

    // ============================================
    // TEST 4: Opérations de base (SET/GET)
    // ============================================

    section("TEST 4: Opérations de base (SET/GET)");

    const testKey = "test:connection:" + Date.now();
    const testValue = "Hello from MyProPartner!";

    try {
        // SET
        await redis.set(testKey, testValue);
        success(`SET réussi - Clé: ${testKey}`);

        // GET
        const retrieved = await redis.get(testKey);
        if (retrieved === testValue) {
            success(`GET réussi - Valeur récupérée correctement`);
        } else {
            error(`GET a retourné une valeur incorrecte: ${retrieved}`);
        }

        // DELETE
        await redis.del(testKey);
        success(`DEL réussi - Clé de test supprimée`);
    } catch (err) {
        error(`Opérations SET/GET/DEL ont échoué: ${(err as Error).message}`);
    }

    // ============================================
    // TEST 5: Vérifier les clés de rate limiting existantes
    // ============================================

    section("TEST 5: Clés de rate limiting existantes");

    try {
        // Scanner les clés commençant par "ratelimit:chatbot:"
        const keys = await redis.keys("ratelimit:chatbot:*");

        if (keys && keys.length > 0) {
            success(`${keys.length} clé(s) de rate limiting trouvée(s)`);
            console.log(`\nClés existantes:`);
            keys.slice(0, 10).forEach((key) => {
                console.log(`  - ${key}`);
            });
            if (keys.length > 10) {
                console.log(`  ... et ${keys.length - 10} autres`);
            }
        } else {
            info(
                "Aucune clé de rate limiting trouvée (normal si pas encore de tests)"
            );
        }
    } catch (err) {
        info(`Impossible de lister les clés: ${(err as Error).message}`);
    }

    // ============================================
    // TEST 6: Latence
    // ============================================

    section("TEST 6: Latence Redis");

    try {
        const start = Date.now();
        await redis.ping();
        const latency = Date.now() - start;

        if (latency < 50) {
            success(`Latence: ${latency}ms (excellente)`);
        } else if (latency < 100) {
            success(`Latence: ${latency}ms (bonne)`);
        } else if (latency < 200) {
            info(`Latence: ${latency}ms (acceptable)`);
        } else {
            error(`Latence: ${latency}ms (lente - vérifier la région Upstash)`);
        }
    } catch (err) {
        error(`Impossible de mesurer la latence: ${(err as Error).message}`);
    }

    // ============================================
    // RÉSUMÉ
    // ============================================

    section("RÉSUMÉ");

    success("🎉 Tous les tests ont réussi !");
    console.log(
        `\n${colors.green}Redis est correctement configuré et prêt à être utilisé.${colors.reset}\n`
    );

    console.log(`${colors.cyan}Prochaines étapes:${colors.reset}`);
    console.log(`1. Démarrer le serveur: npm run dev`);
    console.log(`2. Tester le chatbot avec un compte STARTER`);
    console.log(
        `3. Envoyer 6 messages en <1 min → Message 6 devrait être bloqué`
    );
    console.log(
        `4. Vérifier les métriques sur https://console.upstash.com/redis\n`
    );

    console.log(`${colors.cyan}Limites par plan:${colors.reset}`);
    console.log(`  FREE:       0 messages/min`);
    console.log(`  STARTER:    5 messages/min`);
    console.log(`  PRO:        20 messages/min`);
    console.log(`  ENTERPRISE: 50 messages/min\n`);
}

main().catch((err) => {
    console.error(
        `\n${colors.red}❌ Erreur fatale:${colors.reset}`,
        err.message
    );
    process.exit(1);
});
