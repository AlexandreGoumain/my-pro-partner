"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FORMAT_VARIABLES } from "@/lib/types/settings";
import { Plus, Trash2, Minus, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface FormatBuilderProps {
    value: string;
    code: string;
    onChange: (value: string) => void;
}

type FormatPart = {
    id: string;
    type: "variable" | "separator";
    value: string;
};

export function FormatBuilder({ value, code, onChange }: FormatBuilderProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Parse format string to parts
    const parseParts = (format: string): FormatPart[] => {
        const parts: FormatPart[] = [];
        let currentText = "";
        let i = 0;

        while (i < format.length) {
            if (format[i] === "{") {
                // Save any text before this as separator
                if (currentText) {
                    parts.push({
                        id: Math.random().toString(),
                        type: "separator",
                        value: currentText,
                    });
                    currentText = "";
                }

                // Find closing brace
                const endIdx = format.indexOf("}", i);
                if (endIdx !== -1) {
                    const varName = format.substring(i + 1, endIdx);
                    parts.push({
                        id: Math.random().toString(),
                        type: "variable",
                        value: varName,
                    });
                    i = endIdx + 1;
                } else {
                    currentText += format[i];
                    i++;
                }
            } else {
                currentText += format[i];
                i++;
            }
        }

        // Add any remaining text
        if (currentText) {
            parts.push({
                id: Math.random().toString(),
                type: "separator",
                value: currentText,
            });
        }

        return parts;
    };

    // Build format string from parts
    const buildFormat = (parts: FormatPart[]): string => {
        return parts
            .map((part) => {
                if (part.type === "variable") {
                    return `{${part.value}}`;
                }
                return part.value;
            })
            .join("");
    };

    const parts = parseParts(value);

    const handleAddVariable = (varName: string) => {
        const newParts = [...parts, { id: Math.random().toString(), type: "variable" as const, value: varName }];
        onChange(buildFormat(newParts));
    };

    const handleAddSeparator = (separator: string) => {
        const newParts = [...parts, { id: Math.random().toString(), type: "separator" as const, value: separator }];
        onChange(buildFormat(newParts));
    };

    const handleRemovePart = (id: string) => {
        const newParts = parts.filter((p) => p.id !== id);
        onChange(buildFormat(newParts.length > 0 ? newParts : [{ id: Math.random().toString(), type: "variable", value: "CODE" }]));
    };

    const handleClear = () => {
        onChange("{CODE}{NUM5}");
    };

    return (
        <div className="space-y-3">
            {/* Current Format Display */}
            <div className="flex items-center gap-2 flex-wrap p-3 bg-black/5 rounded-md border border-black/10 min-h-[48px]">
                {parts.length === 0 ? (
                    <span className="text-[13px] text-black/40">Cliquez sur les boutons ci-dessous pour construire votre format</span>
                ) : (
                    parts.map((part) => (
                        <div
                            key={part.id}
                            className="inline-flex items-center gap-1 group"
                        >
                            {part.type === "variable" ? (
                                <Badge
                                    variant="outline"
                                    className="h-7 pl-2 pr-1 gap-1 bg-white border-black/20 text-black font-mono text-[12px]"
                                >
                                    {`{${part.value}}`}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemovePart(part.id)}
                                    >
                                        <Minus className="h-3 w-3" strokeWidth={2} />
                                    </Button>
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="h-7 pl-2 pr-1 gap-1 bg-black/10 border-black/10 text-black/60 font-mono text-[12px]"
                                >
                                    {part.value}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemovePart(part.id)}
                                    >
                                        <Minus className="h-3 w-3" strokeWidth={2} />
                                    </Button>
                                </Badge>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Variables */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/60">Ajouter une variable</Label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddVariable("CODE")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Code
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddVariable("NUM5")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Numéro (5)
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddVariable("YEAR")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Année
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddVariable("MONTH")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Mois
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddVariable("TYPE")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Type doc
                    </Button>
                </div>
            </div>

            {/* Add Separators */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/60">Ajouter un séparateur</Label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5 font-mono"
                        onClick={() => handleAddSeparator("-")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        -
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5 font-mono"
                        onClick={() => handleAddSeparator("/")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        /
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5 font-mono"
                        onClick={() => handleAddSeparator("_")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        _
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[12px] border-black/10 hover:bg-black/5"
                        onClick={() => handleAddSeparator(" ")}
                    >
                        <Plus className="h-3 w-3 mr-1" strokeWidth={2} />
                        Espace
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-black/8">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[12px] text-black/40 hover:text-black hover:bg-black/5"
                    onClick={handleClear}
                >
                    <Trash2 className="h-3 w-3 mr-1" strokeWidth={2} />
                    Réinitialiser
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[12px] text-black/40 hover:text-black hover:bg-black/5"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? "Masquer" : "Mode avancé"}
                </Button>
            </div>

            {/* Advanced Mode: Manual Input */}
            {showAdvanced && (
                <div className="space-y-2 pt-2 border-t border-black/8">
                    <Label htmlFor="format-manual" className="text-[13px] font-medium text-black/60">
                        Mode manuel (avancé)
                    </Label>
                    <Input
                        id="format-manual"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-9 font-mono text-[12px] border-black/10"
                        placeholder="{CODE}{NUM5}"
                    />
                </div>
            )}
        </div>
    );
}
