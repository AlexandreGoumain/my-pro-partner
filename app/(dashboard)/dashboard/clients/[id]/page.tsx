"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClient, useDeleteClient } from "@/hooks/use-clients";
import {
    ArrowLeft,
    Edit,
    Mail,
    MapPin,
    Phone,
    Trash2,
    FileText,
    Calendar,
    Euro,
    Clock,
    Activity,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Send,
    FilePlus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ClientEditDialog } from "@/components/client-edit-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    const { data: client, isLoading } = useClient(clientId);
    const deleteClient = useDeleteClient();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Calcul du statut et score santé
    const clientHealth = useMemo(() => {
        if (!client) return null;

        const now = new Date();
        const daysSinceUpdate = differenceInDays(
            now,
            new Date(client.updatedAt)
        );

        // Score de complétude (0-100)
        let completionScore = 0;
        if (client.email) completionScore += 25;
        if (client.telephone) completionScore += 25;
        if (client.adresse) completionScore += 25;
        if (client.ville && client.codePostal) completionScore += 25;

        // Statut basé sur l'activité
        let status: "active" | "inactive" | "warning";
        if (daysSinceUpdate <= 30) {
            status = "active";
        } else if (daysSinceUpdate <= 90) {
            status = "warning";
        } else {
            status = "inactive";
        }

        return {
            status,
            daysSinceUpdate,
            completionScore,
        };
    }, [client]);

    const handleEdit = () => {
        setEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        toast.success("Client modifié", {
            description: "Le client a été modifié avec succès",
        });
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!client) return;

        deleteClient.mutate(client.id, {
            onSuccess: () => {
                toast.success("Client supprimé", {
                    description: "Le client a été supprimé avec succès",
                });
                router.push("/dashboard/clients");
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le client",
                });
            },
        });
    };

    const handleSendEmail = () => {
        if (client?.email) {
            window.location.href = `mailto:${client.email}`;
        }
    };

    const handleCall = () => {
        if (client?.telephone) {
            window.location.href = `tel:${client.telephone}`;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-64 bg-black/5 rounded animate-pulse" />
                <Card className="p-8 border-black/8 shadow-sm">
                    <div className="space-y-4">
                        <div className="h-8 w-full bg-black/5 rounded animate-pulse" />
                        <div className="h-8 w-3/4 bg-black/5 rounded animate-pulse" />
                        <div className="h-8 w-1/2 bg-black/5 rounded animate-pulse" />
                    </div>
                </Card>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="space-y-6">
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-5">
                        <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-black/40" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                Client introuvable
                            </h3>
                            <p className="text-[14px] text-black/60 max-w-md">
                                Le client demandé n'existe pas ou a été supprimé.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/dashboard/clients")}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 mt-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 text-black/60" strokeWidth={2} />
                            <span className="text-black/80">Retour à la liste</span>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const nomComplet = client.prenom
        ? `${client.nom} ${client.prenom}`
        : client.nom;

    const initiales = client.prenom
        ? `${client.nom.charAt(0)}${client.prenom.charAt(0)}`
        : client.nom.substring(0, 2);

    const statusConfig = {
        active: {
            label: "Actif",
            className: "bg-green-100 text-green-700 border-green-200",
            icon: CheckCircle2,
        },
        warning: {
            label: "Peu actif",
            className: "bg-orange-100 text-orange-700 border-orange-200",
            icon: Clock,
        },
        inactive: {
            label: "Inactif",
            className: "bg-red-100 text-red-700 border-red-200",
            icon: AlertCircle,
        },
    };

    const currentStatus = clientHealth
        ? statusConfig[clientHealth.status]
        : null;

    return (
        <div className="space-y-6">
            {/* Header avec retour */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-black/10 hover:bg-black/5"
                    onClick={() => router.push("/dashboard/clients")}
                >
                    <ArrowLeft className="h-4 w-4 text-black/60" strokeWidth={2} />
                </Button>
                <p className="text-[14px] text-black/60">Retour à la liste</p>
            </div>

            {/* En-tête client avec statut */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border border-black/10">
                                <AvatarFallback className="bg-black text-white text-[18px] font-semibold">
                                    {initiales.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                                        {nomComplet}
                                    </h1>
                                    {currentStatus && (
                                        <Badge
                                            variant="secondary"
                                            className={`border-0 text-[12px] h-6 px-2.5 ${
                                                clientHealth?.status === "active"
                                                    ? "bg-black/5 text-black/60"
                                                    : clientHealth?.status === "warning"
                                                    ? "bg-black/10 text-black/70"
                                                    : "bg-black/15 text-black/80"
                                            }`}
                                        >
                                            <currentStatus.icon className="h-3 w-3 mr-1.5" strokeWidth={2} />
                                            {currentStatus.label}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-[13px] text-black/40">
                                    Client depuis le{" "}
                                    {format(new Date(client.createdAt), "dd MMMM yyyy", {
                                        locale: fr,
                                    })}
                                    {clientHealth && clientHealth.daysSinceUpdate > 0 && (
                                        <span className="ml-2">
                                            • Dernière activité il y a{" "}
                                            {clientHealth.daysSinceUpdate} jour
                                            {clientHealth.daysSinceUpdate > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleEdit}
                                variant="outline"
                                className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <Edit className="w-4 h-4 mr-2 text-black/60" strokeWidth={2} />
                                <span className="text-black/80">Modifier</span>
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="outline"
                                className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 text-black/60"
                            >
                                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* KPIs rapides */}
            <div className="grid gap-5 md:grid-cols-4">
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">Complétude</p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {clientHealth?.completionScore || 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">Documents</p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">0</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Euro className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">CA Total</p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">0€</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">Dernière commande</p>
                                <p className="text-[14px] font-medium text-black/60">Aucune</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions rapides */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSendEmail}
                            disabled={!client.email}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4 mr-2" strokeWidth={2} />
                            Envoyer un email
                        </Button>
                        <Button
                            onClick={handleCall}
                            disabled={!client.telephone}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Phone className="h-4 w-4 mr-2 text-black/60" strokeWidth={2} />
                            <span className="text-black/80">Appeler</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <FilePlus className="h-4 w-4 mr-2 text-black/60" strokeWidth={2} />
                            <span className="text-black/80">Créer un devis</span>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-5">
                <TabsList className="bg-black/5 border-black/10">
                    <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Aperçu
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Activité
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                        >
                            0
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="documents"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Documents
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                        >
                            0
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="notes"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Notes
                    </TabsTrigger>
                </TabsList>

                {/* Tab Aperçu */}
                <TabsContent value="overview" className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Informations de contact */}
                        <Card className="border-black/8 shadow-sm">
                            <div className="p-5">
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                                    Informations de contact
                                </h3>
                                <div className="space-y-4">
                                    {client.email ? (
                                        <div className="flex items-center gap-3.5">
                                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-black/60" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-black/40">Email</p>
                                                <p className="text-[14px] font-medium text-black">
                                                    {client.email}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                                            <AlertCircle className="h-4 w-4" strokeWidth={2} />
                                            <span>Email non renseigné</span>
                                        </div>
                                    )}

                                    {client.telephone ? (
                                        <div className="flex items-center gap-3.5">
                                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-black/60" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-black/40">Téléphone</p>
                                                <p className="text-[14px] font-medium text-black">
                                                    {client.telephone}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                                            <AlertCircle className="h-4 w-4" strokeWidth={2} />
                                            <span>Téléphone non renseigné</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Adresse */}
                        <Card className="border-black/8 shadow-sm">
                            <div className="p-5">
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                                    Adresse
                                </h3>
                                {client.adresse ||
                                client.ville ||
                                client.codePostal ||
                                client.pays ? (
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-black/60" strokeWidth={2} />
                                        </div>
                                        <div>
                                            {client.adresse && (
                                                <p className="text-[14px] font-medium text-black">
                                                    {client.adresse}
                                                </p>
                                            )}
                                            {(client.codePostal || client.ville) && (
                                                <p className="text-[14px] font-medium text-black">
                                                    {client.codePostal} {client.ville}
                                                </p>
                                            )}
                                            {client.pays && (
                                                <p className="text-[13px] text-black/40 mt-1">
                                                    {client.pays}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                                        <AlertCircle className="h-4 w-4" strokeWidth={2} />
                                        <span>Adresse non renseignée</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Notes */}
                    {client.notes && (
                        <Card className="border-black/8 shadow-sm">
                            <div className="p-5">
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                                    Notes internes
                                </h3>
                                <p className="text-[14px] text-black/80 whitespace-pre-wrap leading-relaxed">
                                    {client.notes}
                                </p>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                {/* Tab Activité */}
                <TabsContent value="activity">
                    <Card className="p-12 border-black/8 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-5">
                            <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                                <Activity className="w-10 h-10 text-black/40" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                    Aucune activité
                                </h3>
                                <p className="text-[14px] text-black/60 max-w-md">
                                    L'historique des interactions avec ce client apparaîtra ici.
                                </p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Tab Documents */}
                <TabsContent value="documents">
                    <Card className="p-12 border-black/8 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-5">
                            <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-black/40" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                    Aucun document
                                </h3>
                                <p className="text-[14px] text-black/60 max-w-md">
                                    Les devis, factures et autres documents liés à ce client
                                    apparaîtront ici.
                                </p>
                            </div>
                            <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2">
                                <FilePlus className="w-4 h-4 mr-2" strokeWidth={2} />
                                Créer un document
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* Tab Notes */}
                <TabsContent value="notes">
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Notes internes
                                </h3>
                                <Button
                                    size="sm"
                                    className="h-9 px-4 text-[13px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" strokeWidth={2} />
                                    Ajouter une note
                                </Button>
                            </div>
                            {client.notes ? (
                                <p className="text-[14px] text-black/80 whitespace-pre-wrap leading-relaxed">
                                    {client.notes}
                                </p>
                            ) : (
                                <p className="text-[14px] text-black/40 text-center py-10">
                                    Aucune note pour ce client
                                </p>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <ClientEditDialog
                client={client}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isLoading={deleteClient.isPending}
                title="Supprimer le client"
                description={`Êtes-vous sûr de vouloir supprimer le client "${nomComplet}" ? Cette action est irréversible.`}
            />
        </div>
    );
}
