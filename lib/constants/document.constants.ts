export const DOCUMENT_DEFAULTS = {
    VALIDITY_DAYS: 30,
    FETCH_LIMIT: 1000,
    DEFAULT_TVA_RATE: 20,
    DEFAULT_QUANTITY: 1,
    DEFAULT_DISCOUNT: 0,
} as const;

export const DOCUMENT_TYPES = {
    QUOTE: "DEVIS",
    INVOICE: "FACTURE",
    CREDIT_NOTE: "AVOIR",
} as const;

export const DOCUMENT_STATUS = {
    DRAFT: "BROUILLON",
    SENT: "ENVOYE",
    ACCEPTED: "ACCEPTE",
    REFUSED: "REFUSE",
    PAID: "PAYE",
    CANCELLED: "ANNULE",
} as const;

export const MESSAGES = {
    ERRORS: {
        LOAD_CLIENTS: "Impossible de charger les clients",
        LOAD_ARTICLES: "Impossible de charger les articles",
        CREATE_DOCUMENT: "Impossible de créer le document",
        SELECT_CLIENT: "Veuillez sélectionner un client",
        ADD_LINE: "Veuillez ajouter au moins une ligne",
    },
    SUCCESS: {
        DRAFT_SAVED: "Document enregistré en brouillon",
        QUOTE_SENT: "Devis créé et envoyé avec succès",
        INVOICE_SENT: "Facture créée et envoyée avec succès",
    },
} as const;
