import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

export interface RachatActionsProps {
    rachatId: string;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete: (id: string) => void;
}

export function RachatActions({
    rachatId,
    onView,
    onEdit,
    onDelete,
}: RachatActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-black/10 hover:bg-black/5"
                >
                    <MoreVertical className="h-4 w-4" strokeWidth={2} />
                    <span className="sr-only">Actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 border-black/10 bg-white shadow-sm"
            >
                {onView && (
                    <DropdownMenuItem
                        onClick={() => onView(rachatId)}
                        className="cursor-pointer text-[14px] text-black hover:bg-black/5"
                    >
                        <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                        Voir les détails
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem
                        onClick={() => onEdit(rachatId)}
                        className="cursor-pointer text-[14px] text-black hover:bg-black/5"
                    >
                        <Pencil className="mr-2 h-4 w-4" strokeWidth={2} />
                        Modifier
                    </DropdownMenuItem>
                )}
                {(onView || onEdit) && <DropdownMenuSeparator className="bg-black/8" />}
                <DropdownMenuItem
                    onClick={() => onDelete(rachatId)}
                    className="cursor-pointer text-[14px] text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
