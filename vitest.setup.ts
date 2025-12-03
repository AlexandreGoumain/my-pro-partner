// ==============================================
// VITEST SETUP - Configuration des tests
// ==============================================

import "@testing-library/jest-dom/vitest";

// Ce fichier s'exécute AVANT chaque fichier de test.
// Il configure les matchers de testing-library comme:
// - toBeInTheDocument()
// - toHaveTextContent()
// - toBeVisible()
// - toBeDisabled()
// - etc.

// Mock des APIs du navigateur qui n'existent pas dans jsdom
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
});

// Mock de ResizeObserver (utilisé par certains composants UI)
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock de IntersectionObserver (utilisé pour le lazy loading)
global.IntersectionObserver = class IntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
} as unknown as typeof IntersectionObserver;
