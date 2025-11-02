"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Package, Wrench } from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area";

interface Article {
    id: string;
    nom: string;
    reference?: string;
    type: "PRODUIT" | "SERVICE";
    prix_ht: number;
    tva_taux: number;
}

interface ArticleComboboxProps {
    articles: Article[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    triggerClassName?: string;
}

export function ArticleCombobox({
    articles,
    value,
    onValueChange,
    placeholder = "Choisir un article",
    searchPlaceholder = "Rechercher un article...",
    emptyText = "Aucun article trouvé.",
    className,
    disabled = false,
    triggerClassName,
}: ArticleComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedArticle = articles.find((article) => article.id === value);

    // Grouper les articles par type
    const produits = React.useMemo(
        () => articles.filter((a) => a.type === "PRODUIT"),
        [articles]
    );
    const services = React.useMemo(
        () => articles.filter((a) => a.type === "SERVICE"),
        [articles]
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price);
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
                    {selectedArticle ? selectedArticle.nom : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-[450px] p-0", className)} align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {emptyText}
                            </div>
                        </CommandEmpty>
                        <ScrollArea className="h-[320px]">
                            {produits.length > 0 && (
                                <CommandGroup>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 flex items-center gap-2">
                                        <Package className="h-4 w-4" strokeWidth={2} />
                                        PRODUITS ({produits.length})
                                    </div>
                                    {produits.map((article) => (
                                        <CommandItem
                                            key={article.id}
                                            value={`${article.nom} ${article.reference || ""}`}
                                            onSelect={() => {
                                                onValueChange(article.id === value ? "" : article.id);
                                                setOpen(false);
                                            }}
                                            className="pl-8"
                                        >
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{article.nom}</span>
                                                    {article.reference && (
                                                        <span className="text-xs text-muted-foreground shrink-0">
                                                            {article.reference}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatPrice(article.prix_ht)} HT • TVA {article.tva_taux}%
                                                </span>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 shrink-0",
                                                    value === article.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {services.length > 0 && (
                                <CommandGroup>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-purple-600 flex items-center gap-2">
                                        <Wrench className="h-4 w-4" strokeWidth={2} />
                                        SERVICES ({services.length})
                                    </div>
                                    {services.map((article) => (
                                        <CommandItem
                                            key={article.id}
                                            value={`${article.nom} ${article.reference || ""}`}
                                            onSelect={() => {
                                                onValueChange(article.id === value ? "" : article.id);
                                                setOpen(false);
                                            }}
                                            className="pl-8"
                                        >
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">{article.nom}</span>
                                                    {article.reference && (
                                                        <span className="text-xs text-muted-foreground shrink-0">
                                                            {article.reference}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatPrice(article.prix_ht)} HT • TVA {article.tva_taux}%
                                                </span>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 shrink-0",
                                                    value === article.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
