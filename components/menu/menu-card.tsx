"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MenuItem } from "@/hooks/use-menu";
import {
    useDeleteMenuItem,
    useToggleMenuItemAvailability,
} from "@/hooks/use-menu";
import { Clock, Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MenuCardProps {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
}

export function MenuCard({ item, onEdit }: MenuCardProps) {
    const toggleAvailability = useToggleMenuItemAvailability();
    const deleteItem = useDeleteMenuItem();

    const handleToggleAvailability = () => {
        toggleAvailability.mutate(
            { id: item.id, disponible: !item.disponible },
            {
                onSuccess: () => {
                    toast.success(
                        item.disponible
                            ? "Plat marqué indisponible"
                            : "Plat disponible"
                    );
                },
                onError: () => {
                    toast.error("Erreur lors de la mise à jour");
                },
            }
        );
    };

    const handleDelete = () => {
        if (confirm(`Supprimer "${item.nom}" ?`)) {
            deleteItem.mutate(item.id, {
                onSuccess: () => {
                    toast.success("Plat supprimé");
                },
                onError: () => {
                    toast.error("Erreur lors de la suppression");
                },
            });
        }
    };

    return (
        <Card
            className={`border-black/8 shadow-sm transition-all duration-200 hover:shadow-md ${
                !item.disponible ? "opacity-60" : ""
            }`}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[15px] font-medium text-black truncate">
                                {item.nom}
                            </h3>
                            {!item.disponible && (
                                <Badge
                                    variant="secondary"
                                    className="bg-black/5 text-black/40 text-[11px]"
                                >
                                    Indisponible
                                </Badge>
                            )}
                        </div>

                        {item.description && (
                            <p className="text-[13px] text-black/50 line-clamp-2 mb-2">
                                {item.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[16px] font-semibold text-black">
                                {item.prix.toFixed(2)} €
                            </span>

                            {item.tempsPreparation && (
                                <span className="flex items-center gap-1 text-[12px] text-black/40">
                                    <Clock className="w-3 h-3" />
                                    {item.tempsPreparation} min
                                </span>
                            )}
                        </div>

                        {item.allergenes && item.allergenes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {item.allergenes.slice(0, 3).map((allergen) => (
                                    <Badge
                                        key={allergen}
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 border-black/10 text-black/50"
                                    >
                                        {allergen}
                                    </Badge>
                                ))}
                                {item.allergenes.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 border-black/10 text-black/50"
                                    >
                                        +{item.allergenes.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-black/40 hover:text-black hover:bg-black/5"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleToggleAvailability}
                            >
                                {item.disponible ? (
                                    <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Marquer indisponible
                                    </>
                                ) : (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Marquer disponible
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
