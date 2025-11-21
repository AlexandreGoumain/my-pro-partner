"use client";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    BarChart3,
    FileText,
    Package,
    Receipt,
    Search,
    Settings,
    ShoppingCart,
    Users,
    Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GlobalSearchProps {
    className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // Raccourci clavier Cmd+K / Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (callback: () => void) => {
        setOpen(false);
        callback();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative inline-flex h-10 w-full max-w-[320px] items-center justify-start gap-2 rounded-lg border border-black/10 bg-white px-3 text-[13px] text-black/50 shadow-sm transition-all duration-200 hover:border-black/20 hover:bg-black/[0.02] hover:text-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            >
                <Search
                    className="h-[14px] w-[14px] shrink-0 opacity-50 transition-opacity group-hover:opacity-70"
                    strokeWidth={2}
                />
                <span className="text-[13px] font-normal">Rechercher...</span>
                <kbd className="pointer-events-none ml-auto hidden select-none items-center gap-0.5 rounded border border-black/[0.08] bg-black/[0.04] px-1.5 py-0.5 font-mono text-[11px] font-medium text-black/50 transition-colors group-hover:border-black/[0.12] group-hover:bg-black/[0.06] sm:inline-flex">
                    <span className="text-[10px]">⌘</span>K
                </kbd>
            </button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                showCloseButton={false}
                className="max-w-[640px]"
            >
                <CommandInput
                    placeholder="Rechercher des clients, articles, documents..."
                />
                <CommandList>
                    <CommandEmpty>
                        Aucun résultat trouvé.
                    </CommandEmpty>

                    <CommandGroup heading="Navigation">
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() => router.push("/dashboard"))
                            }
                        >
                            <BarChart3 strokeWidth={2} />
                            <span>Tableau de bord</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/clients")
                                )
                            }
                        >
                            <Users strokeWidth={2} />
                            <span>Clients</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/catalogue")
                                )
                            }
                        >
                            <Package strokeWidth={2} />
                            <span>Catalogue</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/documents/invoices")
                                )
                            }
                        >
                            <FileText strokeWidth={2} />
                            <span>Factures</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/documents/quotes")
                                )
                            }
                        >
                            <Receipt strokeWidth={2} />
                            <span>Devis</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/rachats")
                                )
                            }
                        >
                            <ShoppingCart strokeWidth={2} />
                            <span>Rachats</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/atelier")
                                )
                            }
                        >
                            <Wrench strokeWidth={2} />
                            <span>Atelier</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Analytics">
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push(
                                        "/dashboard/analytics/profitability"
                                    )
                                )
                            }
                        >
                            <BarChart3 strokeWidth={2} />
                            <span>Analyse de rentabilité</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/analytics/unpaid")
                                )
                            }
                        >
                            <FileText strokeWidth={2} />
                            <span>Factures impayées</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/analytics/debtors")
                                )
                            }
                        >
                            <Users strokeWidth={2} />
                            <span>Clients débiteurs</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Paramètres">
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push(
                                        "/dashboard/parametres/entreprise"
                                    )
                                )
                            }
                        >
                            <Settings strokeWidth={2} />
                            <span>Entreprise</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                handleSelect(() =>
                                    router.push("/dashboard/parametres/equipe")
                                )
                            }
                        >
                            <Users strokeWidth={2} />
                            <span>Équipe</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
