import type { EntityLabels } from "./types";

/**
 * Labels prédéfinis pour les entités courantes
 */
export const ENTITY_LABELS = {
    article: {
        singular: "article",
        plural: "articles",
        article: "l'",
    },
    client: {
        singular: "client",
        plural: "clients",
        article: "le",
    },
    segment: {
        singular: "segment",
        plural: "segments",
        article: "le",
    },
    campaign: {
        singular: "campagne",
        plural: "campagnes",
        article: "la",
    },
    document: {
        singular: "document",
        plural: "documents",
        article: "le",
    },
    facture: {
        singular: "facture",
        plural: "factures",
        article: "la",
    },
    devis: {
        singular: "devis",
        plural: "devis",
        article: "le",
    },
    avoir: {
        singular: "avoir",
        plural: "avoirs",
        article: "l'",
    },
    reservation: {
        singular: "réservation",
        plural: "réservations",
        article: "la",
    },
    personnel: {
        singular: "membre du personnel",
        plural: "membres du personnel",
        article: "le",
    },
    category: {
        singular: "catégorie",
        plural: "catégories",
        article: "la",
    },
} as const satisfies Record<string, EntityLabels>;
