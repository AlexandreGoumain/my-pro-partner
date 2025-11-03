"use client";

import { Check, ChevronsUpDown, FileText } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Serie {
    id: string;
    code: string;
    nom: string;
    format_numero: string;
}

interface SerieComboboxProps {
    series: Serie[];
    value: string;
    onValueChange: (value: string) => void;
    triggerClassName?: string;
}

export function SerieCombobox({
    series,
    value,
    onValueChange,
    triggerClassName,
}: SerieComboboxProps) {
    const [open, setOpen] = useState(false);

    const selectedSerie = series.find((serie) => serie.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between border-black/10 hover:bg-black/5",
                        !value && "text-black/40",
                        triggerClassName
                    )}
                >
                    {selectedSerie ? (
                        <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-black/40" strokeWidth={2} />
                            {selectedSerie.nom}
                            <code className="text-[11px] font-mono text-black/40 ml-1">
                                ({selectedSerie.code})
                            </code>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-black/40" strokeWidth={2} />
                            Série par défaut
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" strokeWidth={2} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Rechercher une série..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Aucune série trouvée</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="default"
                                onSelect={() => {
                                    onValueChange("");
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        !value ? "opacity-100" : "opacity-0"
                                    )}
                                    strokeWidth={2}
                                />
                                <FileText className="h-4 w-4 mr-2 text-black/40" strokeWidth={2} />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-medium">Série par défaut</span>
                                    <span className="text-[12px] text-black/40">
                                        Utilise la série définie dans les paramètres
                                    </span>
                                </div>
                            </CommandItem>
                            {series.map((serie) => (
                                <CommandItem
                                    key={serie.id}
                                    value={serie.id}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === serie.id ? "opacity-100" : "opacity-0"
                                        )}
                                        strokeWidth={2}
                                    />
                                    <FileText className="h-4 w-4 mr-2 text-black/40" strokeWidth={2} />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-medium">{serie.nom}</span>
                                            <code className="text-[11px] font-mono text-black/40">
                                                {serie.code}
                                            </code>
                                        </div>
                                        <code className="text-[11px] font-mono text-black/40 mt-0.5">
                                            Format: {serie.format_numero}
                                        </code>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
