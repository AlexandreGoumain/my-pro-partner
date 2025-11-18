/**
 * Centralized toast notification messages
 * Provides consistent toast messages across the application
 */

import { toast } from "sonner";

/**
 * Generic toast helpers for common CRUD operations
 */
export const toastHelpers = {
  /**
   * Show a success toast for resource creation
   */
  created: (resourceName: string, description?: string) => {
    toast.success(`${resourceName} créé${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''}`, {
      description: description || `Le ${resourceName.toLowerCase()} a été créé${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''} avec succès`,
    });
  },

  /**
   * Show a success toast for resource update
   */
  updated: (resourceName: string, description?: string) => {
    toast.success(`${resourceName} modifié${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''}`, {
      description: description || `Le ${resourceName.toLowerCase()} a été modifié${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''} avec succès`,
    });
  },

  /**
   * Show a success toast for resource deletion
   */
  deleted: (resourceName: string, description?: string) => {
    toast.success(`${resourceName} supprimé${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''}`, {
      description: description || `Le ${resourceName.toLowerCase()} a été supprimé${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''} avec succès`,
    });
  },

  /**
   * Show a success toast for resource duplication
   */
  duplicated: (resourceName: string, description?: string) => {
    toast.success(`${resourceName} dupliqué${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''}`, {
      description: description || `Le ${resourceName.toLowerCase()} a été dupliqué${resourceName.endsWith('e') || resourceName.endsWith('ion') ? 'e' : ''} avec succès`,
    });
  },

  /**
   * Show an error toast with proper error message extraction
   */
  error: (error: unknown, customMessage?: string) => {
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Une erreur est survenue";

    toast.error(customMessage || "Erreur", {
      description: errorMessage,
    });
  },

  /**
   * Show a generic success toast
   */
  success: (title: string, description?: string) => {
    toast.success(title, description ? { description } : undefined);
  },

  /**
   * Show a generic info toast
   */
  info: (title: string, description?: string) => {
    toast.info(title, description ? { description } : undefined);
  },

  /**
   * Show a warning toast
   */
  warning: (title: string, description?: string) => {
    toast.warning(title, description ? { description } : undefined);
  },

  /**
   * Show a loading toast
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a toast by ID
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

/**
 * Resource-specific toast messages
 * Provides pre-configured messages for common resources
 */
export const toastMessages = {
  // Client toasts
  client: {
    created: () => toastHelpers.created("Client"),
    updated: () => toastHelpers.updated("Client"),
    deleted: () => toastHelpers.deleted("Client"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur client"),
  },

  // Article toasts
  article: {
    created: () => toastHelpers.created("Article"),
    updated: () => toastHelpers.updated("Article"),
    deleted: () => toastHelpers.deleted("Article"),
    duplicated: () => toastHelpers.duplicated("Article"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur article"),
  },

  // Document toasts (Factures, Devis, etc.)
  document: {
    created: (type: string = "Document") => toastHelpers.created(type),
    updated: (type: string = "Document") => toastHelpers.updated(type),
    deleted: (type: string = "Document") => toastHelpers.deleted(type),
    sent: (type: string = "Document") => {
      toast.success(`${type} envoyé${type.endsWith('e') ? 'e' : ''}`, {
        description: `Le ${type.toLowerCase()} a été envoyé avec succès`,
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur document"),
  },

  // Campaign toasts
  campaign: {
    created: () => toastHelpers.created("Campagne"),
    updated: () => toastHelpers.updated("Campagne"),
    deleted: () => toastHelpers.deleted("Campagne"),
    sent: () => {
      toast.success("Campagne envoyée", {
        description: "La campagne a été envoyée avec succès",
      });
    },
    scheduled: () => {
      toast.success("Campagne programmée", {
        description: "La campagne a été programmée avec succès",
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur campagne"),
  },

  // Segment toasts
  segment: {
    created: () => toastHelpers.created("Segment"),
    updated: () => toastHelpers.updated("Segment"),
    deleted: () => toastHelpers.deleted("Segment"),
    recalculated: () => {
      toast.success("Segment recalculé", {
        description: "Le segment a été recalculé avec succès",
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur segment"),
  },

  // Category toasts
  category: {
    created: () => {
      toast.success("Catégorie créée avec succès");
    },
    updated: () => {
      toast.success("Catégorie modifiée avec succès");
    },
    deleted: () => {
      toast.success("Catégorie supprimée avec succès");
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur catégorie"),
  },

  // Store toasts
  store: {
    created: () => toastHelpers.created("Magasin"),
    updated: () => toastHelpers.updated("Magasin"),
    deleted: () => toastHelpers.deleted("Magasin"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur magasin"),
  },

  // Stock movement toasts
  stock: {
    created: () => {
      toast.success("Mouvement de stock créé avec succès");
    },
    updated: () => toastHelpers.updated("Mouvement de stock"),
    deleted: () => toastHelpers.deleted("Mouvement de stock"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur lors de la création du mouvement"),
  },

  // Table toasts
  table: {
    created: () => toastHelpers.created("Table"),
    updated: () => toastHelpers.updated("Table"),
    deleted: () => toastHelpers.deleted("Table"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur table"),
  },

  // Personnel toasts
  personnel: {
    created: () => toastHelpers.created("Membre du personnel"),
    updated: () => toastHelpers.updated("Membre du personnel"),
    deleted: () => toastHelpers.deleted("Membre du personnel"),
    error: (error: unknown) => toastHelpers.error(error, "Erreur personnel"),
  },

  // Automation toasts
  automation: {
    created: () => {
      toast.success("Automation créée");
    },
    updated: () => {
      toast.success("Automation mise à jour");
    },
    deleted: () => toastHelpers.deleted("Automation"),
    activated: () => {
      toast.success("Automation activée");
    },
    deactivated: () => {
      toast.success("Automation désactivée");
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur automation"),
  },

  // Loyalty points toasts
  loyalty: {
    added: (points: number) => {
      toast.success("Points ajoutés", {
        description: `${points} points ont été ajoutés avec succès`,
      });
    },
    deducted: (points: number) => {
      toast.success("Points déduits", {
        description: `${points} points ont été déduits avec succès`,
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur points de fidélité"),
  },

  // Bank transaction toasts
  bank: {
    reconciled: () => {
      toast.success("Transaction rapprochée");
    },
    imported: (count: number) => {
      toast.success("Import réussi", {
        description: `${count} transaction${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''}`,
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur bancaire"),
  },

  // Payment toasts
  payment: {
    recorded: () => {
      toast.success("Paiement enregistré", {
        description: "Le paiement a été enregistré avec succès",
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur paiement"),
  },

  // Import/Export toasts
  import: {
    success: (count: number, resourceName: string = "élément") => {
      toast.success("Import réussi", {
        description: `${count} ${resourceName}${count > 1 ? 's' : ''} importé${count > 1 ? 's' : ''}`,
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur d'import"),
  },

  export: {
    success: (format: string = "CSV") => {
      toast.success("Export réussi", {
        description: `Les données ont été exportées en ${format}`,
      });
    },
    error: (error: unknown) => toastHelpers.error(error, "Erreur d'export"),
  },

  // Form validation toasts
  validation: {
    requiredFields: () => {
      toast.error("Veuillez remplir tous les champs requis");
    },
    invalidEmail: () => {
      toast.error("Adresse email invalide");
    },
    invalidPhone: () => {
      toast.error("Numéro de téléphone invalide");
    },
    customError: (message: string) => {
      toast.error(message);
    },
  },

  // Generic operation toasts
  operation: {
    success: (operation: string) => {
      toast.success(operation);
    },
    error: (operation: string, error: unknown) => {
      toastHelpers.error(error, operation);
    },
  },
};

/**
 * Export individual toast function from sonner for advanced usage
 */
export { toast };
