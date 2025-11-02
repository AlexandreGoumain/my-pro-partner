import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG, TYPE_ICONS } from "@/lib/constants/campaign-config";
import type { CampaignStatus, CampaignType } from "@/lib/constants/campaign-config";
import type { Campaign } from "@/hooks/use-campaigns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Mail, MoreVertical, Send, Users, XCircle } from "lucide-react";

export interface CampaignCardProps {
    campaign: Campaign;
    onEdit: (campaign: Campaign) => void;
    onCancel: (id: string, nom: string) => void;
    onSend: (id: string, nom: string) => void;
}

export function CampaignCard({
    campaign,
    onEdit,
    onCancel,
    onSend,
}: CampaignCardProps) {
    const status = STATUS_CONFIG[campaign.statut as CampaignStatus];
    const TypeIcon = TYPE_ICONS[campaign.type as CampaignType] || Mail;
    const StatusIcon = status.icon;

    return (
        <Card className="border-black/10 shadow-sm hover:shadow-md transition-all duration-200">
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
                                    <Users className="h-4 w-4" strokeWidth={2} />
                                    <span>{campaign.segment.nom}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="font-medium text-black/80">
                                    Destinataires:
                                </span>
                                <span>{campaign.recipientsCount}</span>
                            </div>

                            {campaign.scheduledAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" strokeWidth={2} />
                                    <span>
                                        {format(
                                            new Date(campaign.scheduledAt),
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
                                            new Date(campaign.sentAt),
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
                                    <span>{campaign.sentCount}</span>
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
                        <DropdownMenuContent align="end" className="w-48">
                            {(campaign.statut === "DRAFT" ||
                                campaign.statut === "SCHEDULED") && (
                                <DropdownMenuItem
                                    onClick={() => onEdit(campaign)}
                                    className="text-[14px]"
                                >
                                    Modifier
                                </DropdownMenuItem>
                            )}

                            {(campaign.statut === "DRAFT" ||
                                campaign.statut === "SCHEDULED") && (
                                <DropdownMenuItem
                                    onClick={() => onSend(campaign.id, campaign.nom)}
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
                                        onCancel(campaign.id, campaign.nom)
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
}
