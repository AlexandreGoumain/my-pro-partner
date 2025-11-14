import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { CampaignCard } from "./campaign-card";
import { Mail, Plus } from "lucide-react";
import type { Campaign } from "@/hooks/use-campaigns";

export interface CampaignsListProps {
    campaigns: Campaign[];
    onEdit: (campaign: Campaign) => void;
    onCancel: (id: string, nom: string) => void;
    onSend: (id: string, nom: string) => void;
    onCreate: () => void;
}

export function CampaignsList({
    campaigns,
    onEdit,
    onCancel,
    onSend,
    onCreate,
}: CampaignsListProps) {
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
                    <PrimaryActionButton icon={Plus} onClick={onCreate}>
                        Créer une campagne
                    </PrimaryActionButton>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {campaigns.map((campaign) => (
                <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    onSend={onSend}
                />
            ))}
        </div>
    );
}
