"use client";

import type { CSVMapping, ParsedCSVRow, ValidationError } from "@/lib/types";
import { parseCSV } from "@/lib/utils/csv-parser";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseCSVImportProps {
    mappings: CSVMapping[];
    onImport: (
        data: Record<string, unknown>[]
    ) => Promise<{
        message: string;
        count: number;
        total: number;
        skipped: number;
    } | void>;
    onOpenChange: (open: boolean) => void;
    templateData?: Record<string, unknown>[];
}

export function useCSVImport({
    mappings,
    onImport,
    onOpenChange,
    templateData,
}: UseCSVImportProps) {
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

                    if (mapping.required && (!value || value.trim() === "")) {
                        errors.push({
                            row: rowIndex,
                            field: mapping.csvHeader,
                            message: `${mapping.label} est requis`,
                        });
                    }

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

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (!selectedFile) return;

            if (!selectedFile.name.endsWith(".csv")) {
                toast.error("Veuillez sélectionner un fichier CSV");
                return;
            }

            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                const { headers: parsedHeaders, rows, errors } = parseCSV(content);

                if (errors.length > 0) {
                    errors.forEach((error) => toast.error(error));
                    return;
                }

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
        },
        [mappings, validateData]
    );

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
            const transformedData = parsedData.map((row) => {
                const transformed: Record<string, unknown> = {};
                mappings.forEach((mapping) => {
                    const value = row[mapping.csvHeader];
                    transformed[mapping.targetField] = value || null;
                });
                return transformed;
            });

            const result = await onImport(transformedData);

            if (result && typeof result === "object" && "skipped" in result && result.skipped > 0) {
                toast.success(`Import terminé`, {
                    description: `${result.count} client(s) importé(s), ${result.skipped} ignoré(s) (déjà existants)`,
                });
            } else {
                toast.success(`${transformedData.length} ligne(s) importée(s) avec succès`);
            }

            resetState();
            onOpenChange(false);
        } catch (error) {
            handleImportError(error);
        } finally {
            setImporting(false);
        }
    }, [parsedData, validationErrors, mappings, onImport, onOpenChange]);

    const handleImportError = useCallback(
        (error: unknown) => {
            if (!parsedData) return;

            const message = error instanceof Error ? error.message : "Erreur lors de l'import";
            const errors: ValidationError[] = [];

            // Check for duplicate emails in database
            if (message.includes("email") && message.includes("existent déjà")) {
                const emailMatch = message.match(/: (.+)$/);
                if (emailMatch) {
                    const duplicateEmails = emailMatch[1].split(", ");
                    parsedData.forEach((row, rowIndex) => {
                        const emailValue = row["Email"];
                        if (emailValue && duplicateEmails.some((email) => email.includes(emailValue))) {
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

                emailCounts.forEach((rowIndices) => {
                    if (rowIndices.length > 1) {
                        rowIndices.forEach((rowIndex) => {
                            errors.push({
                                row: rowIndex,
                                field: "Email",
                                message: `Email en double (apparaît ${rowIndices.length} fois dans le fichier)`,
                            });
                        });
                    }
                });
            }

            // Check for duplicate phones in database
            if (message.includes("téléphone") && message.includes("existent déjà")) {
                const phoneMatch = message.match(/: (.+)$/);
                if (phoneMatch) {
                    const duplicatePhones = phoneMatch[1].split(", ").map((p) => p.split(" (")[0]);
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

            // Check for duplicate phones in import
            if (message.includes("numéros de téléphone en double") && message.includes("dans l'import")) {
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

                phoneCounts.forEach((rowIndices) => {
                    if (rowIndices.length > 1) {
                        rowIndices.forEach((rowIndex) => {
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
        },
        [parsedData]
    );

    const downloadTemplate = useCallback(() => {
        if (!templateData || templateData.length === 0) {
            const csvContent = mappings.map((m) => m.csvHeader).join(",");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "template.csv";
            link.click();
            URL.revokeObjectURL(url);
        } else {
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

    const resetState = useCallback(() => {
        setFile(null);
        setParsedData(null);
        setHeaders([]);
        setValidationErrors([]);
        setEditingCell(null);
    }, []);

    return {
        file,
        parsedData,
        headers,
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
    };
}
