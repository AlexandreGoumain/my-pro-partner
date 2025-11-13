import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <Card className="border-black/10">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                        <FileUp className="h-5 w-5 text-black/60" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Importer des clients
                        </h3>
                        <p className="text-[14px] text-black/60">
                            Ajoutez des clients depuis un fichier
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                            isDragging
                                ? "border-black/40 bg-black/5"
                                : "border-black/10 hover:border-black/20"
                        }`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            accept=".csv,.json"
                            onChange={onFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-3">
                            <div className="flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5">
                                    <Upload className="h-6 w-6 text-black/60" strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-black mb-1">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Glissez votre fichier ici"}
                                </p>
                                <p className="text-[13px] text-black/60">
                                    ou cliquez pour sélectionner
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-[13px] bg-black/5 text-black/80 border-0">
                                CSV, JSON
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={onImport}
                        disabled={!selectedFile}
                        className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                    >
                        <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                        Importer des clients
                    </Button>
                </div>
            </div>
        </Card>
    );
}
