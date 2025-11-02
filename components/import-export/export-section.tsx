import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, FileSpreadsheet, FileText } from "lucide-react";

export interface ExportSectionProps {
    isLoading: boolean;
    clientsCount: number;
    onExportCSV: () => void;
    onExportJSON: () => void;
}

export function ExportSection({
    isLoading,
    clientsCount,
    onExportCSV,
    onExportJSON,
}: ExportSectionProps) {
    return (
        <Card>
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Download className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Exporter les clients
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Téléchargez vos données clients
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium mb-1">
                                    Tous les clients seront exportés
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    L'export inclut toutes les informations
                                    disponibles pour chaque client
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={onExportCSV}
                            disabled={isLoading || clientsCount === 0}
                            className="w-full cursor-pointer"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Exporter en CSV
                        </Button>

                        <Button
                            onClick={onExportJSON}
                            disabled={isLoading || clientsCount === 0}
                            variant="outline"
                            className="w-full"
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Exporter en JSON
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
