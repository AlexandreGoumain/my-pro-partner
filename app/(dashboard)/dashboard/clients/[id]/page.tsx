"use client";

import {
    ClientAddressInfo,
    ClientContactInfo,
    ClientDetailLoading,
    ClientDetailNotFound,
    ClientHeader,
    ClientKPIs,
    ClientQuickActions,
} from "@/components/client-detail";
import { ClientDocumentsTab } from "@/components/client-detail/client-documents-tab";
import { ClientEditDialog } from "@/components/client-edit-dialog";
import { ClientEmailDialog } from "@/components/client-email-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientDetailPage } from "@/hooks/use-client-detail-page";
import { useClientDocuments } from "@/hooks/use-documents";
import { Activity, ArrowLeft, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";

export default function ClientDetailPage() {
    const params = useParams();
    const clientId = params.id as string;
    const { data: documents = [] } = useClientDocuments(clientId);
    const handlers = useClientDetailPage(clientId, documents);

    if (handlers.isLoading) {
        return <ClientDetailLoading />;
    }

    if (!handlers.client) {
        return <ClientDetailNotFound onBack={handlers.handleBack} />;
    }

    const {
        client,
        clientHealth,
        nomComplet,
        initiales,
        currentStatus,
        totalCA,
        lastDocument,
    } = handlers;

    return (
        <div className="space-y-6">
            {/* Header avec retour */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-black/10 hover:bg-black/5"
                    onClick={handlers.handleBack}
                >
                    <ArrowLeft
                        className="h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                </Button>
                <p className="text-[14px] text-black/60">Retour à la liste</p>
            </div>

            {/* En-tête client */}
            <ClientHeader
                client={client}
                nomComplet={nomComplet}
                initiales={initiales}
                currentStatus={currentStatus}
                clientHealth={clientHealth}
                onEdit={handlers.handleEdit}
                onDelete={handlers.handleDelete}
                onSendEmail={handlers.handleSendEmail}
            />

            {/* KPIs */}
            <ClientKPIs
                clientHealth={clientHealth}
                documentsCount={documents.length}
                totalCA={totalCA}
                lastDocument={lastDocument}
            />

            {/* Actions rapides */}
            <ClientQuickActions
                client={client}
                onSendEmail={handlers.handleSendEmail}
                onCall={handlers.handleCall}
            />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-5">
                <TabsList className="bg-black/5 border-black/10">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="activity">
                        Activité
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                        >
                            0
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                        Documents
                        <Badge
                            variant="secondary"
                            className="ml-2 bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                        >
                            {documents.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <ClientContactInfo client={client} />
                        <ClientAddressInfo client={client} />
                    </div>

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

                <TabsContent value="activity">
                    <EmptyState
                        icon={Activity}
                        title="Aucune activité"
                        description="L'historique des interactions avec ce client apparaîtra ici."
                    />
                </TabsContent>

                <TabsContent value="documents">
                    <ClientDocumentsTab
                        clientId={clientId}
                        clientName={nomComplet}
                    />
                </TabsContent>

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
                                    <MessageSquare
                                        className="h-4 w-4 mr-2"
                                        strokeWidth={2}
                                    />
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
                open={handlers.editDialogOpen}
                onOpenChange={handlers.setEditDialogOpen}
                onSuccess={handlers.handleEditSuccess}
            />

            <DeleteConfirmDialog
                open={handlers.deleteDialogOpen}
                onOpenChange={handlers.setDeleteDialogOpen}
                onConfirm={handlers.confirmDelete}
                isLoading={handlers.isDeleting}
                title="Supprimer le client"
                description={`Êtes-vous sûr de vouloir supprimer le client "${nomComplet}" ? Cette action est irréversible.`}
            />

            <ClientEmailDialog
                open={handlers.emailDialogOpen}
                onOpenChange={handlers.setEmailDialogOpen}
                client={client}
            />
        </div>
    );
}
