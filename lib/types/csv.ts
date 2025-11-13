/**
 * Types for CSV Import/Export functionality
 */

export interface CSVMapping {
    csvHeader: string;
    targetField: string;
    label: string;
    required?: boolean;
    validator?: (value: string | null) => { valid: boolean; error?: string };
}

export interface ValidationError {
    row: number;
    field: string;
    message: string;
}

export interface ParsedCSVRow {
    [key: string]: string | null;
}
