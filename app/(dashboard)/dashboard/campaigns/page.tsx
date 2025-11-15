"use client";

import { CampaignSchedulerDialog } from "@/components/campaign-scheduler-dialog";
import { CampaignStats, CampaignsList } from "@/components/campaigns";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { StyledTabs } from "@/components/ui/styled-tabs";
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

    const campaignListComponent = (
        <CampaignsList
            campaigns={filteredCampaigns}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSend={handleSend}
            onCreate={handleCreate}
        />
    );

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "stats-grid",
                statsCount: 4,
                itemCount: 5,
                withTabs: true,
                tabsCount: 4,
                statsHeight: "h-24",
                itemHeight: "h-32",
            }}
        >
            <div className="space-y-6">
            <PageHeader
                title="Campagnes"
                description="Planifiez et envoyez des campagnes à vos segments"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouvelle campagne
                    </PrimaryActionButton>
                }
            />

            <CampaignStats
                total={stats.total}
                draft={stats.draft}
                scheduled={stats.scheduled}
                sent={stats.sent}
            />

            <StyledTabs
                defaultValue="all"
                tabs={[
                    {
                        value: "all",
                        label: "Toutes",
                        content: campaignListComponent,
                    },
                    {
                        value: "draft",
                        label: "Brouillons",
                        content: campaignListComponent,
                    },
                    {
                        value: "scheduled",
                        label: "Planifiées",
                        content: campaignListComponent,
                    },
                    {
                        value: "sent",
                        label: "Envoyées",
                        content: campaignListComponent,
                    },
                ]}
                onValueChange={(value) => {
                    if (value === "all") setStatusFilter(null);
                    else if (value === "draft") setStatusFilter("DRAFT");
                    else if (value === "scheduled")
                        setStatusFilter("SCHEDULED");
                    else if (value === "sent") setStatusFilter("SENT");
                }}
            />

            <CampaignSchedulerDialog
                open={schedulerOpen}
                onOpenChange={setSchedulerOpen}
                campaign={editingCampaign}
            />
            </div>
        </ConditionalSkeleton>
    );
}
