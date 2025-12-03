"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import type { CSVUploadStepProps } from "./types";

export function CSVUploadStep({
    mappings,
    onFileChange,
    onDownloadTemplate,
}: CSVUploadStepProps) {
    const requiredColumns = mappings.filter((m) => m.required).map((m) => m.label);
    const optionalColumns = mappings.filter((m) => !m.required).map((m) => m.label);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <label className="flex-1">
                    <Input
                        type="file"
                        accept=".csv"
                        onChange={onFileChange}
                        className="cursor-pointer"
                    />
                </label>
                <Button
                    variant="outline"
                    onClick={onDownloadTemplate}
                    className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                >
                    <Download className="h-4 w-4 mr-2" strokeWidth={2} />
                    Modèle CSV
                </Button>
            </div>

            <div className="group relative overflow-hidden rounded-lg border border-black/[0.08] bg-white p-6 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.005] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black/5 flex-shrink-0">
                        <Upload className="h-5 w-5 text-black/60" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-black mb-3">
                            Format du fichier CSV
                        </h4>
                        <ul className="text-[13px] text-black/70 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-black/40 mt-0.5">•</span>
                                <span>
                                    <span className="font-medium text-black/80">
                                        Colonnes requises:
                                    </span>{" "}
                                    {requiredColumns.join(", ")}
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black/40 mt-0.5">•</span>
                                <span>
                                    <span className="font-medium text-black/80">
                                        Colonnes optionnelles:
                                    </span>{" "}
                                    {optionalColumns.join(", ")}
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black/40 mt-0.5">•</span>
                                <span>
                                    <span className="font-medium text-black/80">Encodage:</span>{" "}
                                    UTF-8
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black/40 mt-0.5">•</span>
                                <span>
                                    <span className="font-medium text-black/80">Séparateur:</span>{" "}
                                    virgule (,)
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
