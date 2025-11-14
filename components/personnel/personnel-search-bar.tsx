/**
 * Barre de recherche et filtres pour le personnel
 * Permet de filtrer par recherche, rôle et statut
 */

import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole, UserStatus } from "@/hooks/personnel/use-personnel";
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/personnel/roles-config";
import { Filter, Search, UserPlus } from "lucide-react";

export interface PersonnelSearchBarProps {
    search: string;
    onSearchChange: (search: string) => void;
    role: UserRole | undefined;
    onRoleChange: (role: UserRole | undefined) => void;
    status: UserStatus | undefined;
    onStatusChange: (status: UserStatus | undefined) => void;
    onAddClick: () => void;
}

export function PersonnelSearchBar({
    search,
    onSearchChange,
    role,
    onRoleChange,
    status,
    onStatusChange,
    onAddClick,
}: PersonnelSearchBarProps) {
    return (
        <Card className="border-black/10">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                        <Input
                            placeholder="Rechercher un employé..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-11 border-black/10 text-[14px]"
                        />
                    </div>

                    {/* Role filter */}
                    <Select
                        value={role || "all"}
                        onValueChange={(value) =>
                            onRoleChange(
                                value === "all" ? undefined : (value as UserRole)
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[180px] h-11 border-black/10">
                            <Filter className="h-4 w-4 mr-2 text-black/60" />
                            <SelectValue placeholder="Filtrer par rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status filter */}
                    <Select
                        value={status || "all"}
                        onValueChange={(value) =>
                            onStatusChange(
                                value === "all" ? undefined : (value as UserStatus)
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[180px] h-11 border-black/10">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Add button */}
                    <PrimaryActionButton icon={UserPlus} onClick={onAddClick}>
                        Ajouter un employé
                    </PrimaryActionButton>
                </div>
            </CardContent>
        </Card>
    );
}
