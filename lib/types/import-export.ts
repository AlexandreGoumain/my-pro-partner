/**
 * Types for Import/Export functionality
 */

export interface ImportExportStats {
    clientsCount: number;
}

export interface ExportOptions {
    isLoading: boolean;
    clientsCount: number;
}

export interface ImportOptions {
    isDragging: boolean;
    selectedFile: File | null;
}

export interface ImportResult {
    message: string;
    count: number;
    total: number;
    skipped: number;
}

export interface ExportData {
    nom: string;
    prenom?: string | null;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays: string;
    notes?: string | null;
    createdAt: Date;
}

// Re-export CSV types for convenience
export type { CSVMapping, ValidationError, ParsedCSVRow } from "./csv";
