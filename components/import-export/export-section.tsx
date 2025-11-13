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
        <Card className="border-black/10">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                        <Download className="h-5 w-5 text-black/60" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Exporter les clients
                        </h3>
                        <p className="text-[14px] text-black/60">
                            Téléchargez vos données clients
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-black/2 rounded-lg border border-black/8">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-black/60 mt-0.5" strokeWidth={2} />
                            <div className="flex-1">
                                <p className="text-[14px] font-medium text-black mb-1">
                                    Tous les clients seront exportés
                                </p>
                                <p className="text-[13px] text-black/60">
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
                            className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                        >
                            <FileText className="w-4 h-4 mr-2" strokeWidth={2} />
                            Exporter en CSV
                        </Button>

                        <Button
                            onClick={onExportJSON}
                            disabled={isLoading || clientsCount === 0}
                            variant="outline"
                            className="w-full h-11 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" strokeWidth={2} />
                            Exporter en JSON
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
