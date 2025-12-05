import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        // Environnement de test (jsdom simule un navigateur)
        environment: "jsdom",

        // Fichier de setup qui s'exécute avant chaque test
        setupFiles: ["./vitest.setup.ts"],

        // Inclure les fichiers de test
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

        // Exclure ces dossiers
        exclude: [
            "node_modules",
            ".next",
            "dist",
            ".git",
        ],

        // Activer les globals (describe, it, expect) sans import
        globals: true,

        // Coverage (optionnel, décommente si tu veux voir la couverture)
        // coverage: {
        //     provider: "v8",
        //     reporter: ["text", "html"],
        //     exclude: ["node_modules", ".next", "**/*.d.ts"],
        // },
    },
    resolve: {
        // Alias pour matcher avec tsconfig.json
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
