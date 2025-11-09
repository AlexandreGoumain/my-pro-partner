/**
 * Configuration des rôles et permissions par défaut
 *
 * Ce fichier définit les permissions par défaut pour chaque rôle utilisateur.
 * Les permissions peuvent être personnalisées individuellement par utilisateur.
 */

export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "EMPLOYEE" | "CASHIER" | "ACCOUNTANT";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "INVITED";

export interface RolePermissions {
  // Permissions Clients
  canViewClients: boolean;
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;

  // Permissions Documents (Devis, Factures)
  canViewDocuments: boolean;
  canCreateDocuments: boolean;
  canEditDocuments: boolean;
  canDeleteDocuments: boolean;
  canValidateDocuments: boolean;

  // Permissions Stock
  canViewStock: boolean;
  canEditStock: boolean;
  canManageStock: boolean;

  // Permissions Produits/Services
  canViewProducts: boolean;
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;

  // Permissions Finances
  canViewFinances: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canExportData: boolean;

  // Permissions Personnel
  canViewUsers: boolean;
  canManageUsers: boolean;
  canViewTimeTracking: boolean;

  // Permissions Paramètres
  canViewSettings: boolean;
  canEditSettings: boolean;

  // Permissions Avancées
  canAccessAPI: boolean;
  canManageBilling: boolean;
  canViewAuditLog: boolean;
}

/**
 * Permissions par défaut pour chaque rôle
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  // OWNER: Accès total à tout
  OWNER: {
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
    canViewDocuments: true,
    canCreateDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: true,
    canValidateDocuments: true,
    canViewStock: true,
    canEditStock: true,
    canManageStock: true,
    canViewProducts: true,
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewFinances: true,
    canManagePayments: true,
    canViewReports: true,
    canExportData: true,
    canViewUsers: true,
    canManageUsers: true,
    canViewTimeTracking: true,
    canViewSettings: true,
    canEditSettings: true,
    canAccessAPI: true,
    canManageBilling: true,
    canViewAuditLog: true,
  },

  // ADMIN: Accès complet sauf facturation
  ADMIN: {
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: true,
    canViewDocuments: true,
    canCreateDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: true,
    canValidateDocuments: true,
    canViewStock: true,
    canEditStock: true,
    canManageStock: true,
    canViewProducts: true,
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewFinances: true,
    canManagePayments: true,
    canViewReports: true,
    canExportData: true,
    canViewUsers: true,
    canManageUsers: true,
    canViewTimeTracking: true,
    canViewSettings: true,
    canEditSettings: true,
    canAccessAPI: true,
    canManageBilling: false, // Seul le propriétaire peut gérer la facturation
    canViewAuditLog: true,
  },

  // MANAGER: Gestion équipe + clients + documents
  MANAGER: {
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: false,
    canViewDocuments: true,
    canCreateDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: false,
    canValidateDocuments: true,
    canViewStock: true,
    canEditStock: true,
    canManageStock: true,
    canViewProducts: true,
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewFinances: true,
    canManagePayments: true,
    canViewReports: true,
    canExportData: true,
    canViewUsers: true,
    canManageUsers: false, // Peut voir mais pas modifier les users
    canViewTimeTracking: true,
    canViewSettings: true,
    canEditSettings: false,
    canAccessAPI: false,
    canManageBilling: false,
    canViewAuditLog: false,
  },

  // EMPLOYEE: Employé standard (lecture + création)
  EMPLOYEE: {
    canViewClients: true,
    canCreateClients: true,
    canEditClients: true,
    canDeleteClients: false,
    canViewDocuments: true,
    canCreateDocuments: true,
    canEditDocuments: true,
    canDeleteDocuments: false,
    canValidateDocuments: false,
    canViewStock: true,
    canEditStock: false,
    canManageStock: true, // Peut créer des mouvements stock
    canViewProducts: true,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewFinances: false,
    canManagePayments: false,
    canViewReports: false,
    canExportData: false,
    canViewUsers: false,
    canManageUsers: false,
    canViewTimeTracking: false,
    canViewSettings: false,
    canEditSettings: false,
    canAccessAPI: false,
    canManageBilling: false,
    canViewAuditLog: false,
  },

  // CASHIER: Caissier (ventes uniquement)
  CASHIER: {
    canViewClients: true,
    canCreateClients: true,
    canEditClients: false,
    canDeleteClients: false,
    canViewDocuments: true,
    canCreateDocuments: true, // Peut créer devis/factures
    canEditDocuments: false,
    canDeleteDocuments: false,
    canValidateDocuments: false,
    canViewStock: true,
    canEditStock: false,
    canManageStock: false,
    canViewProducts: true,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewFinances: false,
    canManagePayments: true, // Peut enregistrer les paiements
    canViewReports: false,
    canExportData: false,
    canViewUsers: false,
    canManageUsers: false,
    canViewTimeTracking: false,
    canViewSettings: false,
    canEditSettings: false,
    canAccessAPI: false,
    canManageBilling: false,
    canViewAuditLog: false,
  },

  // ACCOUNTANT: Comptable (finances uniquement)
  ACCOUNTANT: {
    canViewClients: true,
    canCreateClients: false,
    canEditClients: false,
    canDeleteClients: false,
    canViewDocuments: true,
    canCreateDocuments: false,
    canEditDocuments: false,
    canDeleteDocuments: false,
    canValidateDocuments: true, // Peut valider les devis
    canViewStock: true,
    canEditStock: false,
    canManageStock: false,
    canViewProducts: true,
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewFinances: true,
    canManagePayments: true,
    canViewReports: true,
    canExportData: true, // Peut exporter pour comptabilité
    canViewUsers: false,
    canManageUsers: false,
    canViewTimeTracking: false,
    canViewSettings: false,
    canEditSettings: false,
    canAccessAPI: false,
    canManageBilling: false,
    canViewAuditLog: false,
  },
};

/**
 * Labels des rôles pour l'affichage
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Propriétaire",
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  EMPLOYEE: "Employé",
  CASHIER: "Caissier",
  ACCOUNTANT: "Comptable",
};

/**
 * Descriptions des rôles
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  OWNER: "Accès complet à toutes les fonctionnalités et la gestion de l'abonnement",
  ADMIN: "Accès complet à toutes les fonctionnalités sauf la gestion de l'abonnement",
  MANAGER: "Gestion de l'équipe, des clients et des documents",
  EMPLOYEE: "Accès standard pour créer et modifier des clients et documents",
  CASHIER: "Accès limité aux ventes et à l'encaissement",
  ACCOUNTANT: "Accès aux finances, paiements et exports comptables",
};

/**
 * Labels des statuts
 */
export const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  SUSPENDED: "Suspendu",
  INVITED: "Invitation envoyée",
};

/**
 * Couleurs des statuts (pour badges)
 */
export const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
  INVITED: "warning",
};

/**
 * Permissions labels pour l'affichage
 */
export const PERMISSION_LABELS: Record<keyof RolePermissions, string> = {
  canViewClients: "Voir les clients",
  canCreateClients: "Créer des clients",
  canEditClients: "Modifier les clients",
  canDeleteClients: "Supprimer les clients",
  canViewDocuments: "Voir les documents",
  canCreateDocuments: "Créer des documents",
  canEditDocuments: "Modifier les documents",
  canDeleteDocuments: "Supprimer les documents",
  canValidateDocuments: "Valider les devis",
  canViewStock: "Voir le stock",
  canEditStock: "Modifier le stock",
  canManageStock: "Gérer les mouvements de stock",
  canViewProducts: "Voir les produits",
  canCreateProducts: "Créer des produits",
  canEditProducts: "Modifier les produits",
  canDeleteProducts: "Supprimer les produits",
  canViewFinances: "Voir les finances",
  canManagePayments: "Gérer les paiements",
  canViewReports: "Voir les rapports",
  canExportData: "Exporter les données",
  canViewUsers: "Voir les utilisateurs",
  canManageUsers: "Gérer les utilisateurs",
  canViewTimeTracking: "Voir le suivi du temps",
  canViewSettings: "Voir les paramètres",
  canEditSettings: "Modifier les paramètres",
  canAccessAPI: "Accès API",
  canManageBilling: "Gérer l'abonnement",
  canViewAuditLog: "Voir l'historique d'activité",
};

/**
 * Groupement des permissions par catégorie
 */
export const PERMISSION_CATEGORIES = {
  clients: [
    "canViewClients",
    "canCreateClients",
    "canEditClients",
    "canDeleteClients",
  ],
  documents: [
    "canViewDocuments",
    "canCreateDocuments",
    "canEditDocuments",
    "canDeleteDocuments",
    "canValidateDocuments",
  ],
  stock: [
    "canViewStock",
    "canEditStock",
    "canManageStock",
  ],
  products: [
    "canViewProducts",
    "canCreateProducts",
    "canEditProducts",
    "canDeleteProducts",
  ],
  finances: [
    "canViewFinances",
    "canManagePayments",
    "canViewReports",
    "canExportData",
  ],
  personnel: [
    "canViewUsers",
    "canManageUsers",
    "canViewTimeTracking",
  ],
  settings: [
    "canViewSettings",
    "canEditSettings",
  ],
  advanced: [
    "canAccessAPI",
    "canManageBilling",
    "canViewAuditLog",
  ],
} as const;

export const CATEGORY_LABELS: Record<keyof typeof PERMISSION_CATEGORIES, string> = {
  clients: "Clients",
  documents: "Documents",
  stock: "Stock",
  products: "Produits & Services",
  finances: "Finances",
  personnel: "Personnel",
  settings: "Paramètres",
  advanced: "Avancé",
};

/**
 * Helper pour obtenir les permissions par défaut d'un rôle
 */
export function getDefaultPermissions(role: UserRole): RolePermissions {
  return DEFAULT_ROLE_PERMISSIONS[role];
}

/**
 * Helper pour vérifier si un rôle a accès à une permission
 */
export function roleHasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return DEFAULT_ROLE_PERMISSIONS[role][permission];
}

/**
 * Helper pour obtenir tous les rôles disponibles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(DEFAULT_ROLE_PERMISSIONS) as UserRole[];
}

/**
 * Helper pour vérifier si un rôle peut gérer d'autres utilisateurs
 */
export function canManageRole(userRole: UserRole, targetRole: UserRole): boolean {
  // Le propriétaire peut tout gérer
  if (userRole === "OWNER") return true;

  // L'admin peut gérer tous sauf le propriétaire
  if (userRole === "ADMIN" && targetRole !== "OWNER") return true;

  // Le manager ne peut gérer personne
  return false;
}
