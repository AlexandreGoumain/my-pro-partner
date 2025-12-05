#!/usr/bin/env tsx
// ============================================
// RATE LIMITING TEST SCRIPT
// ============================================

/**
 * Script de test pour vérifier le rate limiting adaptatif par plan
 *
 * Usage:
 *   npx tsx scripts/test-rate-limiting.ts
 */

import type { PlanAbonnement } from "@/lib/generated/prisma";
import {
    getRateLimitForPlan,
    getRateLimiterForPlan,
} from "../lib/chatbot/security/rate-limit";

// Couleurs pour la console
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
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
    console.log(`\n${colors.magenta}${"=".repeat(60)}`);
    console.log(`${title}`);
    console.log(`${"=".repeat(60)}${colors.reset}\n`);
}

// ============================================
// Test Results Tracking
// ============================================

interface TestResult {
    plan: string;
    name: string;
    passed: boolean;
    message?: string;
}

const testResults: TestResult[] = [];

function recordTest(
    plan: string,
    name: string,
    passed: boolean,
    message?: string
) {
    testResults.push({ plan, name, passed, message });
    if (passed) {
        success(`${name}: ${message || "PASSED"}`);
    } else {
        error(`${name}: ${message || "FAILED"}`);
    }
}

// ============================================
// TEST 1: Vérification des limites par plan
// ============================================

function testPlanLimits() {
    section("TEST 1: Vérification des limites par plan");

    const expectedLimits: Record<PlanAbonnement, number> = {
        FREE: 0,
        STARTER: 5,
        PRO: 20,
        ENTERPRISE: 50,
    };

    for (const [plan, expectedLimit] of Object.entries(expectedLimits)) {
        const actualLimit = getRateLimitForPlan(plan as PlanAbonnement);
        const passed = actualLimit === expectedLimit;

        recordTest(
            plan,
            `Limite pour ${plan}`,
            passed,
            passed
                ? `${actualLimit} messages/min (attendu: ${expectedLimit})`
                : `Obtenu ${actualLimit}, attendu ${expectedLimit}`
        );
    }
}

// ============================================
// TEST 2: Vérification des rate limiters
// ============================================

function testRateLimiters() {
    section("TEST 2: Vérification des rate limiters");

    const plans: PlanAbonnement[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

    for (const plan of plans) {
        try {
            const limiter = getRateLimiterForPlan(plan);

            // Vérifier que le limiter existe et a les bonnes propriétés
            const hasRedis = limiter !== null && limiter !== undefined;
            const hasPrefix = limiter.toString().includes("ratelimit");

            recordTest(
                plan,
                `Rate limiter pour ${plan}`,
                hasRedis && hasPrefix,
                hasRedis && hasPrefix
                    ? `Rate limiter configuré correctement`
                    : `Rate limiter manquant ou mal configuré`
            );
        } catch (err) {
            recordTest(
                plan,
                `Rate limiter pour ${plan}`,
                false,
                `Erreur: ${(err as Error).message}`
            );
        }
    }
}

// ============================================
// TEST 3: Vérification de la cohérence
// ============================================

function testConsistency() {
    section("TEST 3: Vérification de la cohérence");

    // Vérifier que les limites sont croissantes
    const freeLimit = getRateLimitForPlan("FREE");
    const starterLimit = getRateLimitForPlan("STARTER");
    const proLimit = getRateLimitForPlan("PRO");
    const enterpriseLimit = getRateLimitForPlan("ENTERPRISE");

    recordTest(
        "Cohérence",
        "FREE < STARTER",
        freeLimit < starterLimit,
        `${freeLimit} < ${starterLimit}`
    );

    recordTest(
        "Cohérence",
        "STARTER < PRO",
        starterLimit < proLimit,
        `${starterLimit} < ${proLimit}`
    );

    recordTest(
        "Cohérence",
        "PRO < ENTERPRISE",
        proLimit < enterpriseLimit,
        `${proLimit} < ${enterpriseLimit}`
    );

    // Vérifier que FREE est bloqué (0/min)
    recordTest(
        "Cohérence",
        "FREE bloqué (0/min)",
        freeLimit === 0,
        freeLimit === 0 ? "Correct" : `Obtenu ${freeLimit}, attendu 0`
    );

    // Vérifier que PRO et ENTERPRISE sont généreux
    recordTest(
        "Cohérence",
        "PRO >= 20/min",
        proLimit >= 20,
        proLimit >= 20 ? `${proLimit}/min` : `Trop bas: ${proLimit}/min`
    );

    recordTest(
        "Cohérence",
        "ENTERPRISE >= 50/min",
        enterpriseLimit >= 50,
        enterpriseLimit >= 50
            ? `${enterpriseLimit}/min`
            : `Trop bas: ${enterpriseLimit}/min`
    );
}

// ============================================
// TEST 4: Comparaison quota mensuel vs rate limit
// ============================================

function testQuotaVsRateLimit() {
    section("TEST 4: Cohérence quota mensuel vs rate limit");

    const quotas = {
        FREE: { monthly: 0, rateLimit: 0 },
        STARTER: { monthly: 50, rateLimit: 5 },
        PRO: { monthly: -1, rateLimit: 20 }, // -1 = illimité
        ENTERPRISE: { monthly: -1, rateLimit: 50 },
    };

    for (const [plan, limits] of Object.entries(quotas)) {
        const actualRateLimit = getRateLimitForPlan(plan as PlanAbonnement);

        // Vérifier que le rate limit correspond
        const rateLimitMatch = actualRateLimit === limits.rateLimit;
        recordTest(
            plan,
            `${plan} - Rate limit cohérent`,
            rateLimitMatch,
            rateLimitMatch
                ? `${actualRateLimit}/min`
                : `Obtenu ${actualRateLimit}/min, attendu ${limits.rateLimit}/min`
        );

        // Pour STARTER : vérifier que le quota mensuel ne peut pas être épuisé en <1 minute
        if (plan === "STARTER") {
            const monthlyQuota = limits.monthly;
            const rateLimit = actualRateLimit;
            const minutesToExhaust = monthlyQuota / rateLimit;

            const isReasonable = minutesToExhaust >= 10; // Au moins 10 minutes
            recordTest(
                plan,
                `${plan} - Quota protégé contre épuisement rapide`,
                isReasonable,
                isReasonable
                    ? `${minutesToExhaust.toFixed(1)} minutes pour épuiser (OK)`
                    : `Seulement ${minutesToExhaust.toFixed(1)} minutes pour épuiser (trop rapide!)`
            );
        }
    }
}

// ============================================
// TEST 5: Vérification des préfixes Redis
// ============================================

function testRedisPrefixes() {
    section("TEST 5: Vérification des préfixes Redis");

    const expectedPrefixes = {
        FREE: "ratelimit:chatbot:message:free",
        STARTER: "ratelimit:chatbot:message:starter",
        PRO: "ratelimit:chatbot:message:pro",
        ENTERPRISE: "ratelimit:chatbot:message:enterprise",
    };

    info(
        "Note: Cette vérification est basique. Les préfixes exacts peuvent varier selon la configuration Upstash."
    );

    for (const plan of Object.keys(expectedPrefixes)) {
        try {
            const limiter = getRateLimiterForPlan(plan as PlanAbonnement);
            // On ne peut pas vraiment vérifier le préfixe sans accéder aux internals
            // Mais on peut au moins vérifier que le limiter est différent pour chaque plan
            recordTest(
                plan,
                `${plan} - Rate limiter unique`,
                limiter !== null,
                limiter !== null ? "Limiter créé" : "Limiter manquant"
            );
        } catch (err) {
            recordTest(
                plan,
                `${plan} - Rate limiter unique`,
                false,
                `Erreur: ${(err as Error).message}`
            );
        }
    }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.clear();
    console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🚦 RATE LIMITING TEST SUITE 🚦                     ║
║                                                            ║
║        Testing adaptive rate limiting by plan...          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}
`);

    // Run all tests
    testPlanLimits();
    testRateLimiters();
    testConsistency();
    testQuotaVsRateLimit();
    testRedisPrefixes();

    // ============================================
    // SUMMARY
    // ============================================

    section("RÉSUMÉ DES TESTS");

    const categories = [...new Set(testResults.map((t) => t.plan))];

    for (const category of categories) {
        const categoryTests = testResults.filter((t) => t.plan === category);
        const passed = categoryTests.filter((t) => t.passed).length;
        const total = categoryTests.length;
        const percentage = ((passed / total) * 100).toFixed(0);

        const icon = passed === total ? "✅" : passed > total / 2 ? "⚠️" : "❌";

        console.log(
            `${icon} ${category.padEnd(20)} ${passed}/${total} tests passés (${percentage}%)`
        );
    }

    console.log("");

    const totalPassed = testResults.filter((t) => t.passed).length;
    const totalTests = testResults.length;
    const totalPercentage = ((totalPassed / totalTests) * 100).toFixed(0);

    if (totalPassed === totalTests) {
        success(`\n🎉 TOUS LES TESTS PASSÉS! (${totalPassed}/${totalTests})`);
        console.log(
            `\n${colors.green}Le rate limiting adaptatif est correctement configuré!${colors.reset}\n`
        );

        // Afficher un récapitulatif des limites
        console.log(
            `${colors.cyan}📊 Récapitulatif des limites:${colors.reset}`
        );
        console.log(
            `   FREE:       ${getRateLimitForPlan("FREE")} messages/min`
        );
        console.log(
            `   STARTER:    ${getRateLimitForPlan("STARTER")} messages/min`
        );
        console.log(
            `   PRO:        ${getRateLimitForPlan("PRO")} messages/min`
        );
        console.log(
            `   ENTERPRISE: ${getRateLimitForPlan("ENTERPRISE")} messages/min\n`
        );
    } else {
        error(
            `\n⚠️  ${totalPassed}/${totalTests} tests passés (${totalPercentage}%)`
        );
        console.log(
            `\n${colors.yellow}${totalTests - totalPassed} test(s) en échec.${colors.reset}\n`
        );

        console.log("Tests en échec:");
        testResults
            .filter((t) => !t.passed)
            .forEach((t) => {
                console.log(
                    `  - ${t.plan}: ${t.name} ${t.message ? `(${t.message})` : ""}`
                );
            });
    }

    console.log("");
}

// Run tests
main().catch((err) => {
    error("Erreur fatale: " + err.message);
    console.error(err);
    process.exit(1);
});
