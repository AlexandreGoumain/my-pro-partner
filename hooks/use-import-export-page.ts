import { useState, useCallback } from "react";
import { useClients, useImportClients, type Client } from "@/hooks/use-clients";
import { useExport } from "@/hooks/use-export";
import { useFileDrop } from "@/hooks/use-file-drop";
import { EXPORT_CSV_HEADERS } from "@/lib/constants/import-export-config";
import type { ImportResult } from "@/lib/types";

export interface ImportExportPageHandlers {
    clients: Client[];
    isLoading: boolean;
    isDragging: boolean;
    selectedFile: File | null;
    importDialogOpen: boolean;
    setImportDialogOpen: (open: boolean) => void;

    handleExportCSV: () => void;
    handleExportJSON: () => void;
    handleDragEnter: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImport: () => void;
    handleCSVImport: (data: Record<string, unknown>[]) => Promise<ImportResult>;
}

export function useImportExportPage(): ImportExportPageHandlers {
    const { data: clients = [], isLoading } = useClients();
    const importClients = useImportClients();
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    // Use custom hooks for export and file drop
    const { handleExportCSV, handleExportJSON } = useExport({
        data: clients,
        headers: EXPORT_CSV_HEADERS,
        entityName: "clients",
    });

    const {
        isDragging,
        selectedFile,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
    } = useFileDrop({
        acceptedTypes: [".csv", ".json", "text/csv", "application/json"],
    });

    const handleImport = useCallback(() => {
        setImportDialogOpen(true);
    }, []);

    const handleCSVImport = useCallback(
        async (data: Record<string, unknown>[]): Promise<ImportResult> => {
            return await importClients.mutateAsync(data);
        },
        [importClients]
    );

    return {
        clients,
        isLoading,
        isDragging,
        selectedFile,
        importDialogOpen,
        setImportDialogOpen,
        handleExportCSV,
        handleExportJSON,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
        handleImport,
        handleCSVImport,
    };
}
