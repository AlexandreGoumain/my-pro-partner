"use client";

import { CampaignSchedulerDialog } from "@/components/campaign-scheduler-dialog";
import { CampaignStats, CampaignsList } from "@/components/campaigns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaignsPage } from "@/hooks/use-campaigns-page";
import { Plus } from "lucide-react";

export default function CampaignsPage() {
    const {
        filteredCampaigns,
        isLoading,
        schedulerOpen,
        setSchedulerOpen,
        editingCampaign,
        setStatusFilter,
        stats,
        handleCreate,
        handleEdit,
        handleCancel,
        handleSend,
    } = useCampaignsPage();

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
            <CampaignStats
                total={stats.total}
                draft={stats.draft}
                scheduled={stats.scheduled}
                sent={stats.sent}
            />

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
