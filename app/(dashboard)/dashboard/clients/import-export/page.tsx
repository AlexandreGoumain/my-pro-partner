"use client";

import { CSVImportDialog } from "@/components/csv-import-dialog";
import {
    ExportSection,
    ImportExportStats,
    ImportInfoCard,
    ImportSection,
} from "@/components/import-export";
import { useImportExportPage } from "@/hooks/use-import-export-page";
import { CSV_MAPPINGS } from "@/lib/constants/import-export-config";

export default function ClientImportExportPage() {
    const {
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
    } = useImportExportPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Import / Export</h2>
                    <p className="text-muted-foreground">
                        Gérez l&apos;import et l&apos;export de vos données
                        clients
                    </p>
                </div>
            </div>

            {/* Stats rapides */}
            <ImportExportStats clientsCount={clients.length} />

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Section Export */}
                <ExportSection
                    isLoading={isLoading}
                    clientsCount={clients.length}
                    onExportCSV={handleExportCSV}
                    onExportJSON={handleExportJSON}
                />

                {/* Section Import */}
                <ImportSection
                    isDragging={isDragging}
                    selectedFile={selectedFile}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onFileSelect={handleFileSelect}
                    onImport={handleImport}
                />
            </div>

            {/* Informations importantes */}
            <ImportInfoCard />

            {/* CSV Import Dialog */}
            <CSVImportDialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
                title="Importer des clients"
                description="Importez plusieurs clients à la fois via un fichier CSV"
                mappings={CSV_MAPPINGS}
                onImport={handleCSVImport}
            />
        </div>
    );
}
