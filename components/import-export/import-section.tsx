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
        <Card>
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Importer des clients
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Ajoutez des clients depuis un fichier
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Zone de drop */}
                    <div
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            isDragging
                                ? "border-primary bg-muted"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Glissez votre fichier ici"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ou cliquez pour sélectionner
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                CSV, JSON
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={onImport}
                        className="w-full cursor-pointer bg-black hover:bg-black/90 text-white"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Importer des clients
                    </Button>
                </div>
            </div>
        </Card>
    );
}
