"use client";

import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { parseCSV } from "@/lib/utils/csv-parser";
import {
    AlertCircle,
    CheckCircle2,
    Download,
    Upload,
    X,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import type { CSVMapping, ValidationError, ParsedCSVRow } from "@/lib/types";

interface CSVImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    mappings: CSVMapping[];
    onImport: (data: Record<string, unknown>[]) => Promise<{ message: string; count: number; total: number; skipped: number } | void>;
    templateData?: Record<string, unknown>[];
}

export function CSVImportDialog({
    open,
    onOpenChange,
    title,
    description,
    mappings,
    onImport,
    templateData,
}: CSVImportDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedCSVRow[] | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [importing, setImporting] = useState(false);
    const [editingCell, setEditingCell] = useState<{
        row: number;
        field: string;
    } | null>(null);

    const validateData = useCallback(
        (data: ParsedCSVRow[]) => {
            const errors: ValidationError[] = [];

            data.forEach((row, rowIndex) => {
                mappings.forEach((mapping) => {
                    const value = row[mapping.csvHeader];

                    // Check required fields
                    if (mapping.required && (!value || value.trim() === "")) {
                        errors.push({
                            row: rowIndex,
                            field: mapping.csvHeader,
                            message: `${mapping.label} est requis`,
                        });
                    }

                    // Custom validation
                    if (mapping.validator && value) {
                        const validation = mapping.validator(value);
                        if (!validation.valid) {
                            errors.push({
                                row: rowIndex,
                                field: mapping.csvHeader,
                                message: validation.error || "Valeur invalide",
                            });
                        }
                    }
                });
            });

            setValidationErrors(errors);
        },
        [mappings]
    );

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith(".csv")) {
            toast.error("Veuillez sélectionner un fichier CSV");
            return;
        }

        setFile(selectedFile);

        // Parse CSV
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;

            const { headers: parsedHeaders, rows, errors } = parseCSV(content);

            if (errors.length > 0) {
                errors.forEach((error) => toast.error(error));
                return;
            }

            // Validate that CSV has required columns
            const missingColumns: string[] = [];
            const requiredMappings = mappings.filter((m) => m.required);

            requiredMappings.forEach((mapping) => {
                if (!parsedHeaders.includes(mapping.csvHeader)) {
                    missingColumns.push(mapping.csvHeader);
                }
            });

            if (missingColumns.length > 0) {
                toast.error("Colonnes requises manquantes", {
                    description: `Les colonnes suivantes sont manquantes : ${missingColumns.join(", ")}`,
                });
                setParsedData(null);
                setHeaders([]);
                return;
            }

            // Warn about optional missing columns
            const missingOptional: string[] = [];
            const optionalMappings = mappings.filter((m) => !m.required);

            optionalMappings.forEach((mapping) => {
                if (!parsedHeaders.includes(mapping.csvHeader)) {
                    missingOptional.push(mapping.csvHeader);
                }
            });

            if (missingOptional.length > 0) {
                toast.warning("Colonnes optionnelles manquantes", {
                    description: `Les colonnes suivantes ne sont pas présentes : ${missingOptional.join(", ")}`,
                });
            }

            setHeaders(parsedHeaders);
            setParsedData(rows);
            validateData(rows);
        };
        reader.readAsText(selectedFile);
    }, [mappings, validateData]);

    const handleCellEdit = useCallback(
        (rowIndex: number, field: string, newValue: string) => {
            if (!parsedData) return;

            const updatedData = [...parsedData];
            updatedData[rowIndex] = {
                ...updatedData[rowIndex],
                [field]: newValue,
            };

            setParsedData(updatedData);
            validateData(updatedData);
            setEditingCell(null);
        },
        [parsedData, validateData]
    );

    const handleRemoveRow = useCallback(
        (rowIndex: number) => {
            if (!parsedData) return;

            const updatedData = parsedData.filter((_, index) => index !== rowIndex);
            setParsedData(updatedData);
            validateData(updatedData);
        },
        [parsedData, validateData]
    );

    const handleImport = useCallback(async () => {
        if (!parsedData || validationErrors.length > 0) return;

        setImporting(true);

        try {
            // Transform data according to mappings
            const transformedData = parsedData.map((row) => {
                const transformed: Record<string, unknown> = {};
                mappings.forEach((mapping) => {
                    const value = row[mapping.csvHeader];
                    transformed[mapping.targetField] = value || null;
                });
                return transformed;
            });

            const result = await onImport(transformedData);

            // Check if result contains detailed info about skipped items
            if (result && typeof result === 'object' && 'skipped' in result && result.skipped > 0) {
                toast.success(`Import terminé`, {
                    description: `${result.count} client(s) importé(s), ${result.skipped} ignoré(s) (déjà existants)`,
                });
            } else {
                toast.success(`${transformedData.length} ligne(s) importée(s) avec succès`);
            }

            // Reset state
            setFile(null);
            setParsedData(null);
            setHeaders([]);
            setValidationErrors([]);
            onOpenChange(false);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erreur lors de l'import";

            // Parse error message to identify problematic rows
            const errors: ValidationError[] = [];

            // Check for duplicate emails
            if (message.includes("email") && message.includes("existent déjà")) {
                // Extract emails from error message
                const emailMatch = message.match(/: (.+)$/);
                if (emailMatch) {
                    const duplicateEmails = emailMatch[1].split(", ");

                    parsedData.forEach((row, rowIndex) => {
                        const emailValue = row["Email"];
                        if (emailValue && duplicateEmails.some(email => email.includes(emailValue))) {
                            errors.push({
                                row: rowIndex,
                                field: "Email",
                                message: "Cet email existe déjà dans votre base de données",
                            });
                        }
                    });
                }
            }

            // Check for duplicate emails in import
            if (message.includes("emails en double") && message.includes("dans l'import")) {
                // Find duplicate emails in the data
                const emailCounts = new Map<string, number[]>();
                parsedData.forEach((row, rowIndex) => {
                    const emailValue = row["Email"];
                    if (emailValue && emailValue.trim() !== "") {
                        if (!emailCounts.has(emailValue)) {
                            emailCounts.set(emailValue, []);
                        }
                        emailCounts.get(emailValue)!.push(rowIndex);
                    }
                });

                // Mark duplicate emails
                emailCounts.forEach((rowIndices) => {
                    if (rowIndices.length > 1) {
                        rowIndices.forEach(rowIndex => {
                            errors.push({
                                row: rowIndex,
                                field: "Email",
                                message: `Email en double (apparaît ${rowIndices.length} fois dans le fichier)`,
                            });
                        });
                    }
                });
            }

            // Check for duplicate phone numbers
            if (message.includes("téléphone") && message.includes("existent déjà")) {
                // Extract phone numbers from error message
                const phoneMatch = message.match(/: (.+)$/);
                if (phoneMatch) {
                    const duplicatePhones = phoneMatch[1].split(", ").map(p => p.split(" (")[0]);

                    parsedData.forEach((row, rowIndex) => {
                        const phoneValue = row["Téléphone"];
                        if (phoneValue && duplicatePhones.includes(phoneValue)) {
                            errors.push({
                                row: rowIndex,
                                field: "Téléphone",
                                message: "Ce numéro existe déjà dans votre base de données",
                            });
                        }
                    });
                }
            }

            // Check for duplicate phone numbers in import
            if (message.includes("numéros de téléphone en double") && message.includes("dans l'import")) {
                // Find duplicate phones in the data
                const phoneCounts = new Map<string, number[]>();
                parsedData.forEach((row, rowIndex) => {
                    const phoneValue = row["Téléphone"];
                    if (phoneValue && phoneValue.trim() !== "") {
                        if (!phoneCounts.has(phoneValue)) {
                            phoneCounts.set(phoneValue, []);
                        }
                        phoneCounts.get(phoneValue)!.push(rowIndex);
                    }
                });

                // Mark duplicate phones
                phoneCounts.forEach((rowIndices) => {
                    if (rowIndices.length > 1) {
                        rowIndices.forEach(rowIndex => {
                            errors.push({
                                row: rowIndex,
                                field: "Téléphone",
                                message: `Téléphone en double (apparaît ${rowIndices.length} fois dans le fichier)`,
                            });
                        });
                    }
                });
            }

            if (errors.length > 0) {
                setValidationErrors(errors);
                toast.error("Erreur lors de l'import", {
                    description: "Veuillez corriger les erreurs en rouge dans le tableau",
                });
            } else {
                toast.error(message);
            }
        } finally {
            setImporting(false);
        }
    }, [parsedData, validationErrors, mappings, onImport, onOpenChange]);

    const downloadTemplate = useCallback(() => {
        if (!templateData || templateData.length === 0) {
            // Create empty template with headers only
            const csvContent = mappings.map((m) => m.csvHeader).join(",");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "template.csv";
            link.click();
            URL.revokeObjectURL(url);
        } else {
            // Use provided template data
            const headers = mappings.map((m) => m.csvHeader);
            const rows = templateData.map((item) =>
                mappings.map((m) => item[m.targetField] || "").join(",")
            );
            const csvContent = [headers.join(","), ...rows].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "template.csv";
            link.click();
            URL.revokeObjectURL(url);
        }
    }, [mappings, templateData]);

    const getRowErrors = (rowIndex: number) => {
        return validationErrors.filter((error) => error.row === rowIndex);
    };

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
                    {/* File upload */}
                    {!parsedData && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="flex-1">
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                </label>
                                <Button
                                    variant="outline"
                                    onClick={downloadTemplate}
                                    className="h-11 border-black/10"
                                >
                                    <Download className="h-4 w-4 mr-2" strokeWidth={2} />
                                    Modèle CSV
                                </Button>
                            </div>

                            <div className="rounded-lg border border-black/10 bg-black/2 p-6">
                                <div className="flex items-start gap-3">
                                    <Upload className="h-5 w-5 text-black/60 mt-0.5" strokeWidth={2} />
                                    <div>
                                        <h4 className="text-[14px] font-medium text-black mb-2">
                                            Format du fichier CSV
                                        </h4>
                                        <ul className="text-[13px] text-black/60 space-y-1">
                                            <li>• Colonnes requises: {mappings.filter((m) => m.required).map((m) => m.label).join(", ")}</li>
                                            <li>• Colonnes optionnelles: {mappings.filter((m) => !m.required).map((m) => m.label).join(", ")}</li>
                                            <li>• Encodage: UTF-8</li>
                                            <li>• Séparateur: virgule (,)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data preview and validation */}
                    {parsedData && (
                        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                            {/* Summary */}
                            <div className="flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-black/5 text-black/80 border-0">
                                        {parsedData.length} ligne(s)
                                    </Badge>
                                    {validationErrors.length === 0 ? (
                                        <Badge className="bg-green-500/10 text-green-700 border-0">
                                            <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={2} />
                                            Prêt à importer
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-500/10 text-red-700 border-0">
                                            <AlertCircle className="h-3 w-3 mr-1" strokeWidth={2} />
                                            {validationErrors.length} erreur(s)
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setFile(null);
                                        setParsedData(null);
                                        setHeaders([]);
                                        setValidationErrors([]);
                                    }}
                                    className="h-9 text-[13px] border-black/10"
                                >
                                    Charger un autre fichier
                                </Button>
                            </div>

                            {/* Data table */}
                            <div className="flex-1 rounded-lg border border-black/10 overflow-auto">
                                <Table>
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16 sticky left-0 bg-white z-10">#</TableHead>
                                        {mappings.map((mapping) => (
                                            <TableHead key={mapping.csvHeader} className="min-w-[150px] whitespace-nowrap">
                                                {mapping.label}
                                                {mapping.required && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </TableHead>
                                        ))}
                                        <TableHead className="w-16 sticky right-0 bg-white z-10"></TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedData.map((row, rowIndex) => {
                                            const rowErrors = getRowErrors(rowIndex);
                                            const hasError = rowErrors.length > 0;

                                            return (
                                                <TableRow
                                                    key={rowIndex}
                                                    className={
                                                        hasError ? "bg-red-50" : undefined
                                                    }
                                                >
                                                    <TableCell className={`font-mono text-[12px] text-black/40 sticky left-0 z-10 ${hasError ? "bg-red-50 border-l-4 border-l-red-500" : "bg-white"}`}>
                                                        {rowIndex + 1}
                                                    </TableCell>
                                                    {mappings.map((mapping) => {
                                                        const value = row[mapping.csvHeader];
                                                        const error = rowErrors.find(
                                                            (e) => e.field === mapping.csvHeader
                                                        );
                                                        const isEditing =
                                                            editingCell?.row === rowIndex &&
                                                            editingCell?.field === mapping.csvHeader;

                                                        return (
                                                            <TableCell
                                                                key={mapping.csvHeader}
                                                                onClick={() =>
                                                                    setEditingCell({
                                                                        row: rowIndex,
                                                                        field: mapping.csvHeader,
                                                                    })
                                                                }
                                                                className={`cursor-pointer hover:bg-black/5 min-w-[150px] ${error ? "bg-red-100 border-2 border-red-500" : ""}`}
                                                            >
                                                                {isEditing ? (
                                                                    <Input
                                                                        autoFocus
                                                                        defaultValue={value || ""}
                                                                        onBlur={(e) =>
                                                                            handleCellEdit(
                                                                                rowIndex,
                                                                                mapping.csvHeader,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === "Enter") {
                                                                                handleCellEdit(
                                                                                    rowIndex,
                                                                                    mapping.csvHeader,
                                                                                    e.currentTarget.value
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="h-8 text-[13px]"
                                                                    />
                                                                ) : (
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            {error && (
                                                                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" strokeWidth={2} />
                                                                            )}
                                                                            <span
                                                                                className={
                                                                                    error
                                                                                        ? "text-red-600 font-medium"
                                                                                        : "text-black/80"
                                                                                }
                                                                            >
                                                                                {value || (
                                                                                    <span className="text-black/40 italic">
                                                                                        vide
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        {error && (
                                                                            <p className="text-[11px] text-red-600 mt-1 font-medium">
                                                                                {error.message}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell className={`sticky right-0 z-10 ${hasError ? "bg-red-50" : "bg-white"}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveRow(rowIndex)
                                                            }
                                                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <X className="h-4 w-4" strokeWidth={2} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-6 text-[14px] border-black/10"
                    >
                        Annuler
                    </Button>
                    {parsedData && (
                        <PrimaryActionButton
                            onClick={handleImport}
                            disabled={validationErrors.length > 0 || importing}
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
