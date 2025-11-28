"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Client } from "@/hooks/use-clients";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ContratFormValues } from "../contrat-dialog";

interface ClientStepProps {
    form: UseFormReturn<ContratFormValues>;
    clients: Client[];
    onClientChange?: (clientId: string) => void;
}

export function ClientStep({ form, clients, onClientChange }: ClientStepProps) {
    const [searchClient, setSearchClient] = useState("");

    const filteredClients = useMemo(() => {
        if (!searchClient) return clients.slice(0, 50);
        const search = searchClient.toLowerCase();
        return clients
            .filter(
                (c) =>
                    c.nom?.toLowerCase().includes(search) ||
                    c.prenom?.toLowerCase().includes(search) ||
                    c.email?.toLowerCase().includes(search)
            )
            .slice(0, 50);
    }, [clients, searchClient]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">
                    Sélectionnez le client
                </h3>
                <p className="text-[13px] text-black/50">
                    Le client pour lequel vous souhaitez créer un contrat
                    d&apos;entretien
                </p>
            </div>

            <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select
                            onValueChange={onClientChange || field.onChange}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionner un client" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <div className="p-2">
                                    <Input
                                        placeholder="Rechercher un client..."
                                        value={searchClient}
                                        onChange={(e) =>
                                            setSearchClient(e.target.value)
                                        }
                                        className="h-9"
                                    />
                                </div>
                                {filteredClients.map((client) => (
                                    <SelectItem
                                        key={client.id}
                                        value={client.id}
                                    >
                                        {client.prenom} {client.nom}
                                        {client.ville && ` - ${client.ville}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Show selected client info */}
            {form.watch("clientId") && (
                <div className="rounded-lg border border-black/10 p-4 bg-black/[0.02]">
                    {(() => {
                        const client = clients.find(
                            (c) => c.id === form.watch("clientId")
                        );
                        if (!client) return null;
                        return (
                            <div className="space-y-1">
                                <p className="text-[14px] font-medium">
                                    {client.prenom} {client.nom}
                                </p>
                                {client.adresse && (
                                    <p className="text-[13px] text-black/60">
                                        {client.adresse}
                                        {client.codePostal &&
                                            `, ${client.codePostal}`}
                                        {client.ville && ` ${client.ville}`}
                                    </p>
                                )}
                                {client.telephone && (
                                    <p className="text-[13px] text-black/50">
                                        {client.telephone}
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
