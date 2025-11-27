"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InitialsBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client } from "@/hooks/use-clients";
import { Search, User, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { RdvFormValues } from "../rdv-dialog";

interface ClientStepProps {
    form: UseFormReturn<RdvFormValues>;
    clients: Client[];
    onClientChange: (clientId: string) => void;
}

export function ClientStep({ form, clients, onClientChange }: ClientStepProps) {
    const clientId = form.watch("clientId");
    const [activeTab, setActiveTab] = useState<string>(
        clientId ? "existant" : "nouveau"
    );
    const [searchClient, setSearchClient] = useState("");

    const filteredClients = useMemo(() => {
        if (!searchClient) return clients.slice(0, 50);
        const search = searchClient.toLowerCase();
        return clients
            .filter(
                (c) =>
                    c.nom?.toLowerCase().includes(search) ||
                    c.prenom?.toLowerCase().includes(search) ||
                    c.telephone?.includes(search)
            )
            .slice(0, 50);
    }, [clients, searchClient]);

    const selectedClient = useMemo(() => {
        if (!clientId) return null;
        return clients.find((c) => c.id === clientId);
    }, [clientId, clients]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === "nouveau") {
            // Clear client selection and reset fields
            form.setValue("clientId", "");
            form.setValue("nomClient", "");
            form.setValue("telephone", "");
            form.setValue("email", "");
        }
    };

    const handleSelectClient = (id: string) => {
        onClientChange(id);
        setActiveTab("existant");
    };

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 h-12 bg-black/5 p-1">
                    <TabsTrigger
                        value="nouveau"
                        className="text-[14px] gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Nouveau client
                    </TabsTrigger>
                    <TabsTrigger
                        value="existant"
                        className="text-[14px] gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <User className="w-4 h-4" />
                        Client existant
                    </TabsTrigger>
                </TabsList>

                {/* Nouveau client */}
                <TabsContent value="nouveau" className="mt-6 space-y-4">
                    <p className="text-[13px] text-black/50 mb-4">
                        Saisissez les informations du nouveau client pour ce
                        rendez-vous.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nomClient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Nom complet *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Marie Dupont"
                                            className="h-11 text-[14px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Téléphone
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="06 12 34 56 78"
                                            className="h-11 text-[14px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[14px]">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="client@email.com"
                                        className="h-11 text-[14px] border-black/10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>

                {/* Client existant */}
                <TabsContent value="existant" className="mt-6 space-y-4">
                    <p className="text-[13px] text-black/50 mb-4">
                        Recherchez et sélectionnez un client existant.
                    </p>

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                        <Input
                            placeholder="Rechercher par nom ou téléphone..."
                            value={searchClient}
                            onChange={(e) => setSearchClient(e.target.value)}
                            className="h-11 pl-10 text-[14px] border-black/10"
                        />
                    </div>

                    {/* Client Selection */}
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    value={field.value || "__placeholder__"}
                                    onValueChange={(val) => {
                                        if (val !== "__placeholder__") {
                                            handleSelectClient(val);
                                        }
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-11 text-[14px] border-black/10">
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value="__placeholder__"
                                            disabled
                                        >
                                            Sélectionner un client
                                        </SelectItem>
                                        {filteredClients.length === 0 ? (
                                            <div className="py-4 text-center text-[13px] text-black/40">
                                                Aucun client trouvé
                                            </div>
                                        ) : (
                                            filteredClients.map((client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id}
                                                >
                                                    <span className="font-medium">
                                                        {client.prenom}{" "}
                                                        {client.nom}
                                                    </span>
                                                    {client.telephone && (
                                                        <span className="text-black/50 ml-2">
                                                            {client.telephone}
                                                        </span>
                                                    )}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    {/* Selected Client Info */}
                    {selectedClient && (
                        <div className="rounded-lg border border-black/10 p-4 bg-black/[0.02]">
                            <div className="flex items-center gap-3">
                                <InitialsBox
                                    initials={`${selectedClient.prenom?.charAt(0) || ""}${selectedClient.nom?.charAt(0) || ""}`}
                                    bgColor="bg-black/10"
                                    textColor="text-black/60"
                                />
                                <div className="flex-1">
                                    <p className="text-[14px] font-medium text-black">
                                        {selectedClient.prenom}{" "}
                                        {selectedClient.nom}
                                    </p>
                                    <div className="flex items-center gap-3 text-[13px] text-black/50">
                                        {selectedClient.telephone && (
                                            <span>
                                                {selectedClient.telephone}
                                            </span>
                                        )}
                                        {selectedClient.email && (
                                            <span>{selectedClient.email}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
