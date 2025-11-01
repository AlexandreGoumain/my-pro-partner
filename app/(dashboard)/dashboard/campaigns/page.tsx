"use client";

import { CampaignSchedulerDialog } from "@/components/campaign-scheduler-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useCampaigns,
    useCancelCampaign,
    useSendCampaign,
} from "@/hooks/use-campaigns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    MessageSquare,
    MoreVertical,
    Plus,
    Send,
    Users,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig = {
    DRAFT: {
        label: "Brouillon",
        color: "bg-black/5 text-black/60",
        icon: Clock,
    },
    SCHEDULED: {
        label: "Planifiée",
        color: "bg-blue-500/10 text-blue-700",
        icon: Calendar,
    },
    SENDING: {
        label: "En cours",
        color: "bg-yellow-500/10 text-yellow-700",
        icon: Send,
    },
    SENT: {
        label: "Envoyée",
        color: "bg-green-500/10 text-green-700",
        icon: CheckCircle2,
    },
    CANCELLED: {
        label: "Annulée",
        color: "bg-red-500/10 text-red-700",
        icon: XCircle,
    },
};

const typeIcons = {
    EMAIL: Mail,
    SMS: MessageSquare,
    PUSH: Bell,
};

export default function CampaignsPage() {
    const [schedulerOpen, setSchedulerOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const { data, isLoading } = useCampaigns();
    const cancelCampaign = useCancelCampaign();
    const sendCampaign = useSendCampaign();

    const campaigns = data?.data || [];

    const filteredCampaigns = statusFilter
        ? campaigns.filter((c) => c.statut === statusFilter)
        : campaigns;

    const handleCancel = async (id: string, nom: string) => {
        if (!confirm(`Annuler la campagne "${nom}" ?`)) return;

        try {
            await cancelCampaign.mutateAsync(id);
            toast.success("Campagne annulée");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'annulation");
        }
    };

    const handleSend = async (id: string, nom: string) => {
        if (!confirm(`Envoyer la campagne "${nom}" maintenant ?`)) return;

        try {
            const result = await sendCampaign.mutateAsync(id);
            toast.success(result.message || "Campagne envoyée");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'envoi");
        }
    };

    const handleEdit = (campaign: any) => {
        setEditingCampaign(campaign);
        setSchedulerOpen(true);
    };

    const handleCreate = () => {
        setEditingCampaign(null);
        setSchedulerOpen(true);
    };

    const stats = {
        total: campaigns.length,
        draft: campaigns.filter((c) => c.statut === "DRAFT").length,
        scheduled: campaigns.filter((c) => c.statut === "SCHEDULED").length,
        sent: campaigns.filter((c) => c.statut === "SENT").length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-[14px] text-black/40">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Campagnes
                    </h1>
                    <p className="text-[14px] text-black/60 mt-1">
                        Planifiez et envoyez des campagnes à vos segments
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                    Nouvelle campagne
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Total
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                                <Mail
                                    className="h-6 w-6 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Brouillons
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {stats.draft}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                                <Clock
                                    className="h-6 w-6 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Planifiées
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {stats.scheduled}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-blue-500/10 flex items-center justify-center">
                                <Calendar
                                    className="h-6 w-6 text-blue-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Envoyées
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {stats.sent}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2
                                    className="h-6 w-6 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="bg-black/5 p-1 h-11">
                    <TabsTrigger
                        value="all"
                        onClick={() => setStatusFilter(null)}
                        className="text-[14px] data-[state=active]:bg-white"
                    >
                        Toutes
                    </TabsTrigger>
                    <TabsTrigger
                        value="draft"
                        onClick={() => setStatusFilter("DRAFT")}
                        className="text-[14px] data-[state=active]:bg-white"
                    >
                        Brouillons
                    </TabsTrigger>
                    <TabsTrigger
                        value="scheduled"
                        onClick={() => setStatusFilter("SCHEDULED")}
                        className="text-[14px] data-[state=active]:bg-white"
                    >
                        Planifiées
                    </TabsTrigger>
                    <TabsTrigger
                        value="sent"
                        onClick={() => setStatusFilter("SENT")}
                        className="text-[14px] data-[state=active]:bg-white"
                    >
                        Envoyées
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <CampaignsList
                        campaigns={filteredCampaigns}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSend={handleSend}
                        onCreate={handleCreate}
                    />
                </TabsContent>

                <TabsContent value="draft" className="mt-0">
                    <CampaignsList
                        campaigns={filteredCampaigns}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSend={handleSend}
                        onCreate={handleCreate}
                    />
                </TabsContent>

                <TabsContent value="scheduled" className="mt-0">
                    <CampaignsList
                        campaigns={filteredCampaigns}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSend={handleSend}
                        onCreate={handleCreate}
                    />
                </TabsContent>

                <TabsContent value="sent" className="mt-0">
                    <CampaignsList
                        campaigns={filteredCampaigns}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSend={handleSend}
                        onCreate={handleCreate}
                    />
                </TabsContent>
            </Tabs>

            {/* Campaign Scheduler Dialog */}
            <CampaignSchedulerDialog
                open={schedulerOpen}
                onOpenChange={setSchedulerOpen}
                campaign={editingCampaign}
            />
        </div>
    );
}

function CampaignsList({
    campaigns,
    onEdit,
    onCancel,
    onSend,
    onCreate,
}: {
    campaigns: any[];
    onEdit: (campaign: any) => void;
    onCancel: (id: string, nom: string) => void;
    onSend: (id: string, nom: string) => void;
    onCreate: () => void;
}) {
    if (campaigns.length === 0) {
        return (
            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-black/5 mx-auto mb-4 flex items-center justify-center">
                        <Mail
                            className="h-8 w-8 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <h3 className="text-[16px] font-medium text-black mb-2">
                        Aucune campagne
                    </h3>
                    <p className="text-[14px] text-black/60 mb-6 max-w-md mx-auto">
                        Créez votre première campagne pour communiquer avec vos
                        clients
                    </p>
                    <Button
                        onClick={onCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Créer une campagne
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {campaigns.map((campaign) => {
                const status = statusConfig[campaign.statut];
                const TypeIcon = typeIcons[campaign.type] || Mail;
                const StatusIcon = status.icon;

                return (
                    <Card
                        key={campaign.id}
                        className="border-black/10 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 rounded-md bg-black/5 flex items-center justify-center">
                                            <TypeIcon
                                                className="h-5 w-5 text-black/60"
                                                strokeWidth={2}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-[15px] font-medium text-black">
                                                {campaign.nom}
                                            </h3>
                                            {campaign.description && (
                                                <p className="text-[13px] text-black/60">
                                                    {campaign.description}
                                                </p>
                                            )}
                                        </div>

                                        <Badge
                                            className={`${status.color} border-0 text-[12px] font-medium`}
                                        >
                                            <StatusIcon
                                                className="h-3 w-3 mr-1"
                                                strokeWidth={2}
                                            />
                                            {status.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-6 text-[13px] text-black/60 mt-4 ml-[52px]">
                                        {campaign.segment && (
                                            <div className="flex items-center gap-2">
                                                <Users
                                                    className="h-4 w-4"
                                                    strokeWidth={2}
                                                />
                                                <span>
                                                    {campaign.segment.nom}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-black/80">
                                                Destinataires:
                                            </span>
                                            <span>
                                                {campaign.recipientsCount}
                                            </span>
                                        </div>

                                        {campaign.scheduledAt && (
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    className="h-4 w-4"
                                                    strokeWidth={2}
                                                />
                                                <span>
                                                    {format(
                                                        new Date(
                                                            campaign.scheduledAt
                                                        ),
                                                        "dd MMM yyyy à HH:mm",
                                                        { locale: fr }
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {campaign.sentAt && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-black/80">
                                                    Envoyée le:
                                                </span>
                                                <span>
                                                    {format(
                                                        new Date(
                                                            campaign.sentAt
                                                        ),
                                                        "dd MMM yyyy à HH:mm",
                                                        { locale: fr }
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {campaign.statut === "SENT" && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-black/80">
                                                    Envois:
                                                </span>
                                                <span>
                                                    {campaign.sentCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 border-black/10 hover:bg-black/5"
                                        >
                                            <MoreVertical
                                                className="h-4 w-4 text-black/60"
                                                strokeWidth={2}
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
                                        {(campaign.statut === "DRAFT" ||
                                            campaign.statut ===
                                                "SCHEDULED") && (
                                            <DropdownMenuItem
                                                onClick={() => onEdit(campaign)}
                                                className="text-[14px]"
                                            >
                                                Modifier
                                            </DropdownMenuItem>
                                        )}

                                        {(campaign.statut === "DRAFT" ||
                                            campaign.statut ===
                                                "SCHEDULED") && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onSend(
                                                        campaign.id,
                                                        campaign.nom
                                                    )
                                                }
                                                className="text-[14px]"
                                            >
                                                <Send
                                                    className="h-4 w-4 mr-2 text-black/60"
                                                    strokeWidth={2}
                                                />
                                                Envoyer maintenant
                                            </DropdownMenuItem>
                                        )}

                                        {campaign.statut === "SCHEDULED" && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onCancel(
                                                        campaign.id,
                                                        campaign.nom
                                                    )
                                                }
                                                className="text-[14px] text-red-600"
                                            >
                                                <XCircle
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Annuler
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
