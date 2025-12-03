"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { CSVPreviewTableProps } from "./types";

export function CSVPreviewTable({
    parsedData,
    mappings,
    validationErrors,
    editingCell,
    onSetEditingCell,
    onCellEdit,
    onRemoveRow,
    onResetFile,
}: CSVPreviewTableProps) {
    const getRowErrors = (rowIndex: number) => {
        return validationErrors.filter((error) => error.row === rowIndex);
    };

    return (
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            {/* Summary */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Badge className="bg-black text-white border-0 text-[12px] h-6 px-3 font-medium">
                        {parsedData.length} ligne(s)
                    </Badge>
                    {validationErrors.length === 0 ? (
                        <Badge className="bg-green-500/10 text-green-700 border-0 text-[12px] h-6 px-3 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                            Prêt à importer
                        </Badge>
                    ) : (
                        <Badge className="bg-red-500/10 text-red-700 border-0 text-[12px] h-6 px-3 font-medium">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                            {validationErrors.length} erreur(s)
                        </Badge>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetFile}
                    className="h-9 text-[13px] border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                >
                    Charger un autre fichier
                </Button>
            </div>

            {/* Data table */}
            <div className="flex-1 rounded-lg border border-black/[0.08] overflow-auto shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16 sticky left-0 bg-white z-10">
                                #
                            </TableHead>
                            {mappings.map((mapping) => (
                                <TableHead
                                    key={mapping.csvHeader}
                                    className="min-w-[150px] whitespace-nowrap"
                                >
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
                                    className={hasError ? "bg-red-50" : undefined}
                                >
                                    <TableCell
                                        className={`font-mono text-[12px] text-black/40 sticky left-0 z-10 ${
                                            hasError
                                                ? "bg-red-50 border-l-4 border-l-red-500"
                                                : "bg-white"
                                        }`}
                                    >
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
                                                    onSetEditingCell({
                                                        row: rowIndex,
                                                        field: mapping.csvHeader,
                                                    })
                                                }
                                                className={`cursor-pointer hover:bg-black/5 min-w-[150px] ${
                                                    error ? "bg-red-100 border-2 border-red-500" : ""
                                                }`}
                                            >
                                                {isEditing ? (
                                                    <Input
                                                        autoFocus
                                                        defaultValue={value || ""}
                                                        onBlur={(e) =>
                                                            onCellEdit(
                                                                rowIndex,
                                                                mapping.csvHeader,
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                onCellEdit(
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
                                                                <AlertCircle
                                                                    className="h-4 w-4 text-red-500 flex-shrink-0"
                                                                    strokeWidth={2}
                                                                />
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
                                    <TableCell
                                        className={`sticky right-0 z-10 ${
                                            hasError ? "bg-red-50" : "bg-white"
                                        }`}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemoveRow(rowIndex)}
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
    );
}
