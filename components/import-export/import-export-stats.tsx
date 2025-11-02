import { Card } from "@/components/ui/card";
import { Download, FileUp, Users } from "lucide-react";

export interface ImportExportStatsProps {
    clientsCount: number;
}

export function ImportExportStats({ clientsCount }: ImportExportStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{clientsCount}</p>
                            <p className="text-sm text-muted-foreground">
                                Clients dans la base
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Download className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">2</p>
                            <p className="text-sm text-muted-foreground">
                                Formats d'export
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <FileUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">CSV</p>
                            <p className="text-sm text-muted-foreground">
                                Format d'import
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
