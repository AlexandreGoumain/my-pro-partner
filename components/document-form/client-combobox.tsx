"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Client {
    id: string;
    nom: string;
    prenom?: string | null;
    email?: string | null;
    telephone?: string | null;
}

interface ClientComboboxProps {
    clients: Client[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    triggerClassName?: string;
}

export function ClientCombobox({
    clients,
    value,
    onValueChange,
    placeholder = "Sélectionner un client",
    searchPlaceholder = "Rechercher un client...",
    emptyText = "Aucun client trouvé.",
    className,
    disabled = false,
    triggerClassName,
}: ClientComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedClient = clients.find((client) => client.id === value);

    const getClientDisplay = (client: Client) => {
        return client.prenom
            ? `${client.nom} ${client.prenom}`
            : client.nom;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between",
                        !value && "text-muted-foreground",
                        triggerClassName
                    )}
                >
                    {selectedClient ? getClientDisplay(selectedClient) : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-[400px] p-0", className)} align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={`${client.nom} ${client.prenom || ""} ${client.email || ""}`}
                                    onSelect={() => {
                                        onValueChange(client.id === value ? "" : client.id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col flex-1">
                                        <span>{getClientDisplay(client)}</span>
                                        {client.email && (
                                            <span className="text-xs text-muted-foreground">
                                                {client.email}
                                            </span>
                                        )}
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
