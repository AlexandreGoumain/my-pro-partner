"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Client } from "@/hooks/use-clients";
import type { StatusConfig, ClientHealth } from "@/lib/types/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, Mail, Trash2 } from "lucide-react";

export interface ClientHeaderProps {
    client: Client;
    nomComplet: string;
    initiales: string;
    currentStatus: StatusConfig | null;
    clientHealth: ClientHealth | null;
    onEdit: () => void;
    onDelete: () => void;
    onSendEmail: () => void;
}

export function ClientHeader({
    client,
    nomComplet,
    initiales,
    currentStatus,
    clientHealth,
    onEdit,
    onDelete,
    onSendEmail,
}: ClientHeaderProps) {
    return (
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
                                        <currentStatus.icon
                                            className="h-3 w-3 mr-1.5"
                                            strokeWidth={2}
                                        />
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
                            onClick={onSendEmail}
                            variant="outline"
                            className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Mail
                                className="w-4 h-4 mr-2 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-black/80">Envoyer un email</span>
                        </Button>
                        <Button
                            onClick={onEdit}
                            variant="outline"
                            className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Edit
                                className="w-4 h-4 mr-2 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-black/80">Modifier</span>
                        </Button>
                        <Button
                            onClick={onDelete}
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
    );
}
