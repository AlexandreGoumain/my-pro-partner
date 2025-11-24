import { Badge } from "@/components/ui/badge";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card } from "@/components/ui/card";
import { FileUp, Upload } from "lucide-react";

export interface ImportSectionProps {
    isDragging: boolean;
    selectedFile: File | null;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImport: () => void;
}

export function ImportSection({
    isDragging,
    selectedFile,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileSelect,
    onImport,
}: ImportSectionProps) {
    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Importer des clients
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Ajoutez des clients depuis un fichier
                    </p>
                </div>

                <div className="space-y-4">
                    <div
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                            isDragging
                                ? "border-black/40 bg-black/5 shadow-md shadow-black/5"
                                : "border-black/[0.12] hover:border-black/25 hover:bg-black/[0.02]"
                        }`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            accept=".csv,.json"
                            onChange={onFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-black/5 transition-all duration-300 group-hover:scale-110">
                                    <Upload className="h-6 w-6 text-black/60" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold text-black mb-1.5">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Glissez votre fichier ici"}
                                </p>
                                <p className="text-[13px] text-black/60">
                                    ou cliquez pour sélectionner
                                </p>
                            </div>
                            <Badge className="bg-black text-white text-[12px] h-6 px-3 font-medium border-0">
                                CSV, JSON
                            </Badge>
                        </div>
                    </div>

                    <PrimaryActionButton
                        onClick={onImport}
                        disabled={!selectedFile}
                        className="w-full"
                    >
                        <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                        Importer des clients
                    </PrimaryActionButton>
                </div>
            </div>
        </Card>
    );
}
