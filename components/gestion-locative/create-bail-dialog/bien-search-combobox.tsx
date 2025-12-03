"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BienWithRelations } from "@/hooks/immobilier/use-biens";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Home } from "lucide-react";

interface BienSearchComboboxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedBien: BienWithRelations | null;
    biens: BienWithRelations[];
    onSelect: (bien: BienWithRelations) => void;
}

export function BienSearchCombobox({
    open,
    onOpenChange,
    selectedBien,
    biens,
    onSelect,
}: BienSearchComboboxProps) {
    return (
        <FormItem>
            <FormLabel className="text-[13px] font-medium">
                Bien <span className="text-destructive">*</span>
            </FormLabel>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between h-11 border-black/10"
                        >
                            {selectedBien ? (
                                <span className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-black/40" />
                                    {selectedBien.titre}
                                </span>
                            ) : (
                                <span className="text-black/40">
                                    Sélectionner un bien disponible...
                                </span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[550px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Rechercher un bien..." />
                        <CommandList>
                            <CommandEmpty>Aucun bien disponible</CommandEmpty>
                            <CommandGroup>
                                {biens.map((bien) => (
                                    <CommandItem
                                        key={bien.id}
                                        value={bien.id}
                                        onSelect={() => onSelect(bien)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedBien?.id === bien.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div>
                                            <p className="font-medium">{bien.titre}</p>
                                            <p className="text-[12px] text-black/40">
                                                {bien.adresse}, {bien.ville}
                                            </p>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
}
