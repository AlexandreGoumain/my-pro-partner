"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { CSVPreviewTable } from "./csv-preview-table";
import { CSVUploadStep } from "./csv-upload-step";
import type { CSVImportDialogProps } from "./types";
import { useCSVImport } from "./use-csv-import";

export function CSVImportDialog({
    open,
    onOpenChange,
    title,
    description,
    mappings,
    onImport,
    templateData,
}: CSVImportDialogProps) {
    const {
        parsedData,
        validationErrors,
        importing,
        editingCell,
        setEditingCell,
        handleFileChange,
        handleCellEdit,
        handleRemoveRow,
        handleImport,
        downloadTemplate,
        resetState,
    } = useCSVImport({
        mappings,
        onImport,
        onOpenChange,
        templateData,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
                <DialogHeaderSection
                    title={title}
                    description={description}
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                    className="flex-shrink-0"
                />

                <div className="space-y-6 py-4 flex-1 overflow-hidden flex flex-col">
                    {/* File upload step */}
                    {!parsedData && (
                        <CSVUploadStep
                            mappings={mappings}
                            onFileChange={handleFileChange}
                            onDownloadTemplate={downloadTemplate}
                        />
                    )}

                    {/* Data preview and validation */}
                    {parsedData && (
                        <CSVPreviewTable
                            parsedData={parsedData}
                            mappings={mappings}
                            validationErrors={validationErrors}
                            editingCell={editingCell}
                            onSetEditingCell={setEditingCell}
                            onCellEdit={handleCellEdit}
                            onRemoveRow={handleRemoveRow}
                            onResetFile={resetState}
                        />
                    )}
                </div>

                <DialogFooter className="flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                    >
                        Annuler
                    </Button>
                    {parsedData && (
                        <PrimaryActionButton
                            onClick={handleImport}
                            disabled={validationErrors.length > 0 || importing}
                            className="h-11 px-6 text-[14px] font-medium"
                        >
                            {importing ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Import en cours...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" strokeWidth={2} />
                                    Importer {parsedData.length} ligne(s)
                                </>
                            )}
                        </PrimaryActionButton>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
