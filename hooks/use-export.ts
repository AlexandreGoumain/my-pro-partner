import { useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { exportToCSV, exportToJSON } from "@/lib/utils/export";
import type { ExportData } from "@/lib/types/import-export";

interface UseExportProps<T extends ExportData> {
    data: T[];
    headers: string[];
    entityName?: string;
}

export function useExport<T extends ExportData>({
    data,
    headers,
    entityName = "data",
}: UseExportProps<T>) {
    const handleExportCSV = useCallback(() => {
        try {
            const filename = `${entityName}_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`;
            exportToCSV(data, headers, filename);

            toast.success("Export réussi", {
                description: `${data.length} ${entityName} exportés en CSV`,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de l'export";
            toast.error(message);
        }
    }, [data, headers, entityName]);

    const handleExportJSON = useCallback(() => {
        try {
            const filename = `${entityName}_${format(new Date(), "yyyy-MM-dd_HHmmss")}.json`;
            exportToJSON(data, filename);

            toast.success("Export réussi", {
                description: `${data.length} ${entityName} exportés en JSON`,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de l'export";
            toast.error(message);
        }
    }, [data, entityName]);

    return {
        handleExportCSV,
        handleExportJSON,
    };
}
