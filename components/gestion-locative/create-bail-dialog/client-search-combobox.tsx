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
import type { Client } from "@/hooks/use-clients";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, User } from "lucide-react";

interface ClientSearchComboboxProps {
    label: string;
    placeholder: string;
    searchPlaceholder: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    search: string;
    onSearchChange: (search: string) => void;
    selectedClient: Client | null;
    clients: Client[];
    onSelect: (client: Client) => void;
    required?: boolean;
}

export function ClientSearchCombobox({
    label,
    placeholder,
    searchPlaceholder,
    open,
    onOpenChange,
    search,
    onSearchChange,
    selectedClient,
    clients,
    onSelect,
    required,
}: ClientSearchComboboxProps) {
    return (
        <FormItem>
            <FormLabel className="text-[13px] font-medium">
                {label} {required && <span className="text-destructive">*</span>}
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
                            {selectedClient ? (
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-black/40" />
                                    {selectedClient.prenom} {selectedClient.nom}
                                </span>
                            ) : (
                                <span className="text-black/40">{placeholder}</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[550px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={search}
                            onValueChange={onSearchChange}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {search.length < 2
                                    ? "Tapez au moins 2 caractères"
                                    : "Aucun client trouvé"}
                            </CommandEmpty>
                            <CommandGroup>
                                {clients.map((client) => (
                                    <CommandItem
                                        key={client.id}
                                        value={client.id}
                                        onSelect={() => onSelect(client)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedClient?.id === client.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {client.prenom} {client.nom}
                                            </p>
                                            <p className="text-[12px] text-black/40">
                                                {client.email || client.telephone || "Pas de contact"}
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
