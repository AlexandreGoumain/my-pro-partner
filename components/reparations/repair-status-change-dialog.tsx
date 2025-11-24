"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { Reparation } from "@/lib/generated/prisma";
import { StatutReparation } from "@/lib/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusChangeSchema = z.object({
  statut: z.nativeEnum(StatutReparation),
  notes: z.string().optional(),
});

type StatusChangeInput = z.infer<typeof statusChangeSchema>;

interface RepairStatusChangeDialogProps {
  reparation: Reparation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Status labels and descriptions
const STATUS_LABELS: Record<StatutReparation, string> = {
  DEPOSE: "Déposé",
  DIAGNOSTIC: "Diagnostic en cours",
  DEVIS_ENVOYE: "Devis envoyé",
  ATTENTE_PIECES: "Attente de pièces",
  EN_COURS: "Réparation en cours",
  PRETE: "Prête à récupérer",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  ABANDONNEE: "Abandonnée",
};

const STATUS_DESCRIPTIONS: Record<StatutReparation, string> = {
  DEPOSE: "L'appareil a été déposé et enregistré",
  DIAGNOSTIC: "Le diagnostic est en cours",
  DEVIS_ENVOYE: "Le devis a été envoyé au client",
  ATTENTE_PIECES: "En attente de réception des pièces",
  EN_COURS: "La réparation est en cours",
  PRETE: "L'appareil est prêt à être récupéré (notification envoyée)",
  LIVREE: "L'appareil a été remis au client",
  ANNULEE: "La réparation a été annulée",
  ABANDONNEE: "La réparation a été abandonnée par le client",
};

// Valid status transitions
const VALID_TRANSITIONS: Record<StatutReparation, StatutReparation[]> = {
  DEPOSE: [
    StatutReparation.DIAGNOSTIC,
    StatutReparation.ANNULEE,
    StatutReparation.ABANDONNEE,
  ],
  DIAGNOSTIC: [
    StatutReparation.DEVIS_ENVOYE,
    StatutReparation.EN_COURS,
    StatutReparation.ANNULEE,
    StatutReparation.ABANDONNEE,
  ],
  DEVIS_ENVOYE: [
    StatutReparation.ATTENTE_PIECES,
    StatutReparation.EN_COURS,
    StatutReparation.ANNULEE,
    StatutReparation.ABANDONNEE,
  ],
  ATTENTE_PIECES: [
    StatutReparation.EN_COURS,
    StatutReparation.ANNULEE,
    StatutReparation.ABANDONNEE,
  ],
  EN_COURS: [
    StatutReparation.ATTENTE_PIECES,
    StatutReparation.PRETE,
    StatutReparation.ANNULEE,
  ],
  PRETE: [StatutReparation.LIVREE, StatutReparation.EN_COURS],
  LIVREE: [], // Final state
  ANNULEE: [], // Final state
  ABANDONNEE: [], // Final state
};

export function RepairStatusChangeDialog({
  reparation,
  open,
  onOpenChange,
  onSuccess,
}: RepairStatusChangeDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<StatusChangeInput>({
    resolver: zodResolver(statusChangeSchema),
    defaultValues: {
      statut: reparation.statut,
      notes: "",
    },
  });

  const statusChangeMutation = useMutation({
    mutationFn: async (data: StatusChangeInput) => {
      const response = await fetch(`/api/reparations/${reparation.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reparations"] });
      queryClient.invalidateQueries({ queryKey: ["reparations-stats"] });
      queryClient.invalidateQueries({ queryKey: ["reparation", reparation.id] });

      toast({
        title: "Statut mis à jour",
        description: "Le client sera notifié par email si nécessaire.",
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StatusChangeInput) => {
    statusChangeMutation.mutate(data);
  };

  // Get available next statuses
  const availableStatuses = VALID_TRANSITIONS[reparation.statut] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
            Changer le statut
          </DialogTitle>
          <DialogDescription className="text-[14px] text-black/40">
            Réparation {reparation.numero} - Statut actuel : {STATUS_LABELS[reparation.statut]}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium">
                    Nouveau statut
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 text-[14px]">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-[14px]">
                          <div>
                            <div className="font-medium">{STATUS_LABELS[status]}</div>
                            <div className="text-[12px] text-black/40">
                              {STATUS_DESCRIPTIONS[status]}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                      {availableStatuses.length === 0 && (
                        <div className="p-4 text-center text-[14px] text-black/40">
                          Aucune transition possible depuis ce statut
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[13px] text-black/40">
                    Seules les transitions valides sont disponibles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium">
                    Notes (optionnel)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ajoutez des notes sur ce changement de statut..."
                      className="min-h-[100px] text-[14px] resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-[13px] text-black/40">
                    Ces notes seront visibles dans l'historique
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
              >
                Annuler
              </Button>
              <PrimaryActionButton
                type="submit"
                disabled={
                  statusChangeMutation.isPending ||
                  availableStatuses.length === 0
                }
                className="h-11 px-6 text-[14px]"
              >
                {statusChangeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </PrimaryActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
