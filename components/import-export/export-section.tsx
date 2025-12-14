import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { CheckCircle2, FileSpreadsheet, FileText } from "lucide-react";

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
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Exporter les clients
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Téléchargez vos données clients
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="group/info relative overflow-hidden p-4 bg-white rounded-lg border border-black/[0.08] hover:shadow-md hover:shadow-black/5 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.005] opacity-0 group-hover/info:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-start gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-black/5 flex-shrink-0">
                                <CheckCircle2
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-black mb-1">
                                    Tous les clients seront exportés
                                </p>
                                <p className="text-[13px] text-black/60">
                                    L&apos;export inclut toutes les informations
                                    disponibles pour chaque client
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <PrimaryActionButton
                            onClick={onExportCSV}
                            disabled={isLoading || clientsCount === 0}
                            className="w-full"
                        >
                            <FileText
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Exporter en CSV
                        </PrimaryActionButton>

                        <Button
                            onClick={onExportJSON}
                            disabled={isLoading || clientsCount === 0}
                            variant="outline"
                            className="w-full h-11 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                        >
                            <FileSpreadsheet
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Exporter en JSON
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
