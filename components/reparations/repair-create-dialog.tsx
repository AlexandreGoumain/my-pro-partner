"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reparationCreateSchema, type ReparationCreateInput } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Loader2 } from "lucide-react";

interface RepairCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RepairCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: RepairCreateDialogProps) {
  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      return data.items;
    },
    enabled: open,
  });

  const form = useForm<ReparationCreateInput>({
    resolver: zodResolver(reparationCreateSchema),
    defaultValues: {
      clientId: "",
      typeAppareil: "SMARTPHONE",
      marque: "",
      modele: "",
      numeroSerie: "",
      motAuthentification: "",
      panne: "",
      etatVisuel: "",
      accessoires: "",
      priorite: "NORMALE",
      reference: "",
      notesInternes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ReparationCreateInput) => {
      const response = await fetch("/api/reparations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create repair");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reparations"] });
      queryClient.invalidateQueries({ queryKey: ["reparations-stats"] });
      form.reset();
      onSuccess();
    },
  });

  const onSubmit = (data: ReparationCreateInput) => {
    createMutation.mutate(data);
  };

  const clients = clientsData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Nouvelle réparation
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Selection */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingClients}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingClients ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.prenom
                              ? `${client.prenom} ${client.nom}`
                              : client.nom}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Device Type */}
            <FormField
              control={form.control}
              name="typeAppareil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'appareil *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PC_PORTABLE">PC Portable</SelectItem>
                      <SelectItem value="PC_BUREAU">PC Bureau</SelectItem>
                      <SelectItem value="MAC">Mac</SelectItem>
                      <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                      <SelectItem value="TABLETTE">Tablette</SelectItem>
                      <SelectItem value="CONSOLE_JEU">Console de jeu</SelectItem>
                      <SelectItem value="SERVEUR">Serveur</SelectItem>
                      <SelectItem value="PERIPHERIQUE">Périphérique</SelectItem>
                      <SelectItem value="AUTRE">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Device Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apple, Samsung, Dell..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="iPhone 13, XPS 15..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Serial & Password */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroSerie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de série</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="IMEI, S/N..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motAuthentification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe / Code PIN</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Si nécessaire pour tests"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Issue Description */}
            <FormField
              control={form.control}
              name="panne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de la panne *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrire le problème rencontré par le client..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visual Condition */}
            <FormField
              control={form.control}
              name="etatVisuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>État visuel</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Rayures, impacts, écran cassé..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Accessories */}
            <FormField
              control={form.control}
              name="accessoires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accessoires inclus</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Chargeur, étui, câbles..."
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priorite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NORMALE">Normale</SelectItem>
                      <SelectItem value="URGENTE">Urgente</SelectItem>
                      <SelectItem value="CRITIQUE">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Internal Notes */}
            <FormField
              control={form.control}
              name="notesInternes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes internes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes visibles uniquement par l'équipe..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Annuler
              </Button>
              <PrimaryActionButton
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer la réparation"
                )}
              </PrimaryActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
