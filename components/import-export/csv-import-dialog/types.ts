import type { CSVMapping, ParsedCSVRow, ValidationError } from "@/lib/types";

export interface CSVImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    mappings: CSVMapping[];
    onImport: (
        data: Record<string, unknown>[]
    ) => Promise<{
        message: string;
        count: number;
        total: number;
        skipped: number;
    } | void>;
    templateData?: Record<string, unknown>[];
}

export interface CSVImportState {
    file: File | null;
    parsedData: ParsedCSVRow[] | null;
    headers: string[];
    validationErrors: ValidationError[];
    importing: boolean;
    editingCell: { row: number; field: string } | null;
}

export interface CSVUploadStepProps {
    mappings: CSVMapping[];
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownloadTemplate: () => void;
}

export interface CSVPreviewTableProps {
    parsedData: ParsedCSVRow[];
    mappings: CSVMapping[];
    validationErrors: ValidationError[];
    editingCell: { row: number; field: string } | null;
    onSetEditingCell: (cell: { row: number; field: string } | null) => void;
    onCellEdit: (rowIndex: number, field: string, newValue: string) => void;
    onRemoveRow: (rowIndex: number) => void;
    onResetFile: () => void;
}
