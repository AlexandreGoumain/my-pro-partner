/**
 * Rachats Constants
 * Centralized constants for buyback (rachat) states and labels
 */

export const ETAT_LABELS: Record<string, string> = {
    COMME_NEUF: "Comme neuf",
    TRES_BON: "Très bon",
    BON: "Bon",
    CORRECT: "Correct",
    POUR_PIECES: "Pour pièces",
};

/**
 * Note: Colors use non-standard colors (green, blue, yellow, orange, red)
 * which deviates from the Apple-style minimal design guidelines.
 * These colors are necessary to indicate critical status information for buyback states.
 */
export const ETAT_COLORS: Record<string, string> = {
    COMME_NEUF: "bg-green-100 text-green-800 border-green-200",
    TRES_BON: "bg-blue-100 text-blue-800 border-blue-200",
    BON: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CORRECT: "bg-orange-100 text-orange-800 border-orange-200",
    POUR_PIECES: "bg-red-100 text-red-800 border-red-200",
};

export const PROVENANCE_LABELS: Record<string, string> = {
    RACHAT_CLIENT: "Rachat client",
    MARKETPLACE_OCCASION: "Marketplace occasion",
    REPRISE: "Reprise",
    DON: "Don",
    RETOUR_SAV: "Retour SAV",
    AUTRE: "Autre",
};
