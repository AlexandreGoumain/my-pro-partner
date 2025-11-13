/**
 * Item de liste pour un employé
 * Affiche les informations de l'employé avec les actions disponibles
 */

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";
import { User } from "@/hooks/personnel/use-personnel";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
    CheckCircle2,
    Mail,
    MoreVertical,
    Pencil,
    Trash2,
    XCircle,
} from "lucide-react";

export interface PersonnelListItemProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onStatusToggle: (user: User, newStatus: "ACTIVE" | "INACTIVE") => void;
}

export function PersonnelListItem({
    user,
    onEdit,
    onDelete,
    onStatusToggle,
}: PersonnelListItemProps) {
    return (
        <div className="flex items-center justify-between p-4 border border-black/8 rounded-lg hover:bg-black/2 transition-all duration-200">
            <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center text-black font-semibold text-[14px]">
                    {(
                        user.prenom?.[0] ||
                        user.name?.[0] ||
                        user.email[0]
                    ).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate text-[14px] text-black">
                            {user.prenom} {user.name || user.email}
                        </p>
                        <RoleBadge role={user.role} showIcon={false} />
                        <StatusBadge status={user.status} showIcon={false} />
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-black/60">
                        <span>{user.email}</span>
                        {user.poste && (
                            <>
                                <span>•</span>
                                <span>{user.poste}</span>
                            </>
                        )}
                        {user.departement && (
                            <>
                                <span>•</span>
                                <span>{user.departement}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Last login */}
                {user.lastLoginAt && (
                    <div className="hidden md:block text-[13px] text-black/60">
                        Dernière connexion:{" "}
                        {formatDistanceToNow(new Date(user.lastLoginAt), {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </div>
                )}
            </div>

            {/* Actions */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-black/5"
                    >
                        <MoreVertical className="h-4 w-4 text-black/60" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-black/10">
                    <DropdownMenuLabel className="text-[13px] text-black/60">
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/8" />
                    <DropdownMenuItem
                        onClick={() => onEdit(user)}
                        className="text-[13px]"
                    >
                        <Pencil className="h-4 w-4 mr-2 text-black/60" />
                        Modifier
                    </DropdownMenuItem>
                    {user.status === "ACTIVE" ? (
                        <DropdownMenuItem
                            onClick={() => onStatusToggle(user, "INACTIVE")}
                            className="text-[13px]"
                        >
                            <XCircle className="h-4 w-4 mr-2 text-black/60" />
                            Désactiver
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => onStatusToggle(user, "ACTIVE")}
                            className="text-[13px]"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2 text-black/60" />
                            Activer
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-[13px]">
                        <Mail className="h-4 w-4 mr-2 text-black/60" />
                        Renvoyer l&apos;invitation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black/8" />
                    <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        className="text-[13px] text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
