/**
 * Centralized type definitions
 * Eliminates duplicate interfaces across components
 */

// Re-export Prisma generated types
export type {
  Article,
  Categorie,
  Client,
  Document,
  LigneDocument,
  Paiement,
  User,
  ParametresEntreprise,
} from "@/lib/generated/prisma";

// Re-export enums
export { DocumentType, DocumentStatut, MoyenPaiement } from "@/lib/generated/prisma";
