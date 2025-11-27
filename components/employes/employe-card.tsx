"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InitialsBox } from "@/components/ui/icon-box";
import type { Employe } from "@/hooks/use-employes";
import {
    Calendar,
    Mail,
    MoreVertical,
    Pencil,
    Phone,
    Trash2,
} from "lucide-react";

interface EmployeCardProps {
    employe: Employe;
    onEdit: (employe: Employe) => void;
    onDelete?: (employe: Employe) => void;
    onDisponibilites?: (employe: Employe) => void;
}

export function EmployeCard({
    employe,
    onEdit,
    onDelete,
    onDisponibilites,
}: EmployeCardProps) {
    return (
        <Card
            className={`border-black/8 shadow-sm hover:border-black/15 transition-all cursor-pointer ${
                !employe.actif ? "opacity-60" : ""
            }`}
            onClick={() => onEdit(employe)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <InitialsBox
                        initials={`${employe.prenom.charAt(0)}${employe.nom.charAt(0)}`}
                        textColor="text-white"
                        bgStyle={{
                            backgroundColor: employe.couleur || "#000000",
                        }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[15px] font-medium text-black truncate">
                                {employe.prenom} {employe.nom}
                            </h3>
                            {!employe.actif && (
                                <Badge
                                    variant="secondary"
                                    className="bg-black/5 text-black/40 text-[11px]"
                                >
                                    Inactif
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-1">
                            {employe.email && (
                                <p className="text-[13px] text-black/50 flex items-center gap-1.5 truncate">
                                    <Mail className="w-3 h-3" />
                                    {employe.email}
                                </p>
                            )}
                            {employe.telephone && (
                                <p className="text-[13px] text-black/50 flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" />
                                    {employe.telephone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-black/40 hover:text-black/60"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(employe);
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                            {onDisponibilites && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDisponibilites(employe);
                                    }}
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Horaires
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(employe);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
