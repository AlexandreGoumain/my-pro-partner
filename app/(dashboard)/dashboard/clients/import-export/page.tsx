"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileUp,
    Download,
    FileText,
    CheckCircle2,
    AlertCircle,
    Upload,
    FileSpreadsheet,
    Users,
} from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ClientImportExportPage() {
    const { data: clients = [], isLoading } = useClients();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleExportCSV = useCallback(() => {
        if (clients.length === 0) {
            toast.error("Aucun client à exporter");
            return;
        }

        // Créer le CSV
        const headers = [
            "Nom",
            "Prénom",
            "Email",
            "Téléphone",
            "Adresse",
            "Code Postal",
            "Ville",
            "Pays",
            "Notes",
            "Date de création",
        ];

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
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        // Télécharger le fichier
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
        if (!selectedFile) {
            toast.error("Aucun fichier sélectionné");
            return;
        }

        // TODO: Implémenter la logique d'import
        toast.info("Fonctionnalité en cours de développement", {
            description: "L'import de clients sera bientôt disponible",
        });
    }, [selectedFile]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Import / Export</h2>
                    <p className="text-muted-foreground">
                        Gérez l'import et l'export de vos données clients
                    </p>
                </div>
            </div>

            {/* Stats rapides */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {clients.length}
                                </p>
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
                                <p className="text-2xl font-bold">
                                    2
                                </p>
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
                                <p className="text-2xl font-bold">
                                    CSV
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Format d'import
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Section Export */}
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
                                    <CheckCircle2
                                        className="h-5 w-5 text-muted-foreground mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium mb-1">
                                            Tous les clients seront exportés
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            L'export inclut toutes les informations disponibles pour
                                            chaque client
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleExportCSV}
                                    disabled={isLoading || clients.length === 0}
                                    className="w-full cursor-pointer"
                                >
                                    <FileText
                                        className="w-4 h-4 mr-2"
                                    />
                                    Exporter en CSV
                                </Button>

                                <Button
                                    onClick={handleExportJSON}
                                    disabled={isLoading || clients.length === 0}
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

                {/* Section Import */}
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
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
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
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-3">
                                    <div className="flex justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                            <Upload
                                                className="h-6 w-6 text-muted-foreground"
                                            />
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

                            {selectedFile && (
                                <Button
                                    onClick={handleImport}
                                    className="w-full cursor-pointer"
                                >
                                    <Upload
                                        className="w-4 h-4 mr-2"
                                    />
                                    Importer le fichier
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Informations importantes */}
            <Card>
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-base font-semibold">
                            Informations importantes
                        </h3>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                            <p>
                                <strong className="font-medium text-foreground">Format CSV :</strong>{" "}
                                Le fichier doit contenir les colonnes suivantes : Nom, Prénom, Email,
                                Téléphone, Adresse, Code Postal, Ville, Pays
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                            <p>
                                <strong className="font-medium text-foreground">Encodage :</strong>{" "}
                                Assurez-vous que votre fichier est encodé en UTF-8 pour éviter les
                                problèmes d'accents
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                            <p>
                                <strong className="font-medium text-foreground">Doublons :</strong>{" "}
                                Les clients avec le même email seront automatiquement détectés et
                                ignorés
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                            <p>
                                <strong className="font-medium text-foreground">Validation :</strong>{" "}
                                Toutes les données importées seront validées avant d'être ajoutées à
                                la base
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
