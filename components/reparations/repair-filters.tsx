"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RepairFiltersProps {
  statut?: string;
  priorite?: string;
  search?: string;
  onStatutChange: (value: string) => void;
  onPrioriteChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function RepairFilters({
  statut,
  priorite,
  search,
  onStatutChange,
  onPrioriteChange,
  onSearchChange,
}: RepairFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
          strokeWidth={2}
        />
        <Input
          placeholder="Rechercher (numéro, client, appareil...)"
          value={search || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-10 border-black/10 focus-visible:ring-black/20"
        />
      </div>

      {/* Status filter */}
      <Select value={statut || "all"} onValueChange={onStatutChange}>
        <SelectTrigger className="w-full sm:w-[200px] h-11 border-black/10">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="DEPOSE">Déposé</SelectItem>
          <SelectItem value="DIAGNOSTIC">En diagnostic</SelectItem>
          <SelectItem value="DEVIS_ENVOYE">Devis envoyé</SelectItem>
          <SelectItem value="ATTENTE_PIECES">Attente pièces</SelectItem>
          <SelectItem value="EN_COURS">En cours</SelectItem>
          <SelectItem value="PRETE">Prête</SelectItem>
          <SelectItem value="LIVREE">Livrée</SelectItem>
          <SelectItem value="ANNULEE">Annulée</SelectItem>
          <SelectItem value="ABANDONNEE">Abandonnée</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority filter */}
      <Select value={priorite || "all"} onValueChange={onPrioriteChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-11 border-black/10">
          <SelectValue placeholder="Toutes priorités" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes priorités</SelectItem>
          <SelectItem value="NORMALE">Normale</SelectItem>
          <SelectItem value="URGENTE">Urgente</SelectItem>
          <SelectItem value="CRITIQUE">Critique</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
