"use client";

import { memo, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/hooks/use-clients";
import {
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Edit,
    Eye,
    Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    getClientFullName,
    getClientInitials,
    formatClientLocation,
    hasContactInfo,
} from "@/lib/utils/client-formatting";

interface ClientCardProps {
    client: Client;
    onView?: (client: Client) => void;
    onEdit?: (client: Client) => void;
    onDelete?: (client: Client) => void;
}

export const ClientCard = memo(function ClientCard({
    client,
    onView,
    onEdit,
    onDelete,
}: ClientCardProps) {
    const nomComplet = getClientFullName(client.nom, client.prenom);
    const initiales = getClientInitials(client.nom, client.prenom);
    const localisation = formatClientLocation(client.ville, client.codePostal);
    const hasContact = hasContactInfo(client);

    const handleView = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onView?.(client);
    }, [client, onView]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(client);
    }, [client, onEdit]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(client);
    }, [client, onDelete]);

    return (
        <Card
            className="group cursor-pointer border-black/8 shadow-sm hover:border-black/20 transition-all duration-200"
            onClick={handleView}
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border border-black/10">
                            <AvatarFallback className="bg-black text-white text-[14px] font-medium">
                                {initiales.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black line-clamp-1 mb-1">
                                {nomComplet}
                            </h3>
                            {client.createdAt && (
                                <p className="text-[12px] text-black/40">
                                    Depuis {format(new Date(client.createdAt), "MMM yyyy", { locale: fr })}
                                </p>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-black/5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4 text-black/60" strokeWidth={2} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleView}>
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-black/80">
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-2.5">
                    {client.email && (
                        <div className="flex items-center gap-2.5">
                            <Mail className="h-4 w-4 text-black/40" strokeWidth={2} />
                            <p className="text-[13px] text-black/60 truncate">{client.email}</p>
                        </div>
                    )}

                    {client.telephone && (
                        <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 text-black/40" strokeWidth={2} />
                            <p className="text-[13px] text-black/60">{client.telephone}</p>
                        </div>
                    )}

                    {localisation && (
                        <div className="flex items-center gap-2.5">
                            <MapPin className="h-4 w-4 text-black/40" strokeWidth={2} />
                            <p className="text-[13px] text-black/60">{localisation}</p>
                        </div>
                    )}

                    {!hasContact && !localisation && (
                        <p className="text-[13px] text-black/40 text-center py-4">
                            Aucune information de contact
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
});
