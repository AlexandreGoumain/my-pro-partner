import { useState, useCallback } from "react";
import { useClients, useImportClients } from "@/hooks/use-clients";
import { toast } from "sonner";
import { format } from "date-fns";
import { EXPORT_CSV_HEADERS } from "@/lib/constants/import-export-config";

export interface ImportExportPageHandlers {
    clients: any[];
    isLoading: boolean;
    isDragging: boolean;
    selectedFile: File | null;
    importDialogOpen: boolean;
    setImportDialogOpen: (open: boolean) => void;

    handleExportCSV: () => void;
    handleExportJSON: () => void;
    handleDragEnter: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImport: () => void;
    handleCSVImport: (data: Record<string, any>[]) => Promise<any>;
}

export function useImportExportPage(): ImportExportPageHandlers {
    const { data: clients = [], isLoading } = useClients();
    const importClients = useImportClients();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const handleExportCSV = useCallback(() => {
        if (clients.length === 0) {
            toast.error("Aucun client à exporter");
            return;
        }

        const rows = clients.map((client) => [
            client.nom || "",
            client.prenom || "",
            client.email || "",
            client.telephone || "",
            client.adresse || "",
            client.codePostal || "",
            client.ville || "",
            client.pays || "",
            client.notes || "",
            format(new Date(client.createdAt), "yyyy-MM-dd HH:mm:ss"),
        ]);

        const csvContent = [
            EXPORT_CSV_HEADERS.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `clients_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Export réussi", {
            description: `${clients.length} clients exportés en CSV`,
        });
    }, [clients]);

    const handleExportJSON = useCallback(() => {
        if (clients.length === 0) {
            toast.error("Aucun client à exporter");
            return;
        }

        const jsonContent = JSON.stringify(clients, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `clients_${format(new Date(), "yyyy-MM-dd_HHmmss")}.json`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Export réussi", {
            description: `${clients.length} clients exportés en JSON`,
        });
    }, [clients]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (
                file.type === "text/csv" ||
                file.type === "application/json" ||
                file.name.endsWith(".csv") ||
                file.name.endsWith(".json")
            ) {
                setSelectedFile(file);
                toast.info("Fichier sélectionné", {
                    description: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
                });
            } else {
                toast.error("Format de fichier non supporté", {
                    description: "Veuillez utiliser un fichier CSV ou JSON",
                });
            }
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            toast.info("Fichier sélectionné", {
                description: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
            });
        }
    }, []);

    const handleImport = useCallback(() => {
        setImportDialogOpen(true);
    }, []);

    const handleCSVImport = useCallback(
        async (data: Record<string, any>[]) => {
            return await importClients.mutateAsync(data);
        },
        [importClients]
    );

    return {
        clients,
        isLoading,
        isDragging,
        selectedFile,
        importDialogOpen,
        setImportDialogOpen,
        handleExportCSV,
        handleExportJSON,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
        handleImport,
        handleCSVImport,
    };
}
