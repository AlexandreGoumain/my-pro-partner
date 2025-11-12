// Dashboard types for client portal

/**
 * Loyalty level information
 * Defines the benefits and appearance of a loyalty tier
 */
export interface LoyaltyLevel {
    /** Display name of the loyalty level */
    nom: string;
    /** Hex color code for visual representation */
    couleur: string;
    /** Discount percentage for this level */
    remise: number;
}

/**
 * Client information for dashboard display
 * Contains basic profile data and loyalty information
 */
export interface DashboardClient {
    /** Client last name */
    nom: string;
    /** Client first name (optional) */
    prenom?: string;
    /** Client phone number (optional) */
    telephone?: string;
    /** Client address (optional) */
    adresse?: string;
    /** Current loyalty points balance */
    points_solde: number;
    /** Current loyalty level (optional) */
    niveauFidelite?: LoyaltyLevel;
}

/**
 * Complete dashboard statistics
 * Aggregated data for the client portal dashboard
 */
export interface DashboardStats {
    /** Client profile and loyalty information */
    client: DashboardClient;
    /** Total number of documents */
    documentsCount: number;
    /** Total amount spent */
    totalSpent: number;
    /** Points expiring soon */
    pointsExpiringSoon: number;
}
