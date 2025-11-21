"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Plus, Trash2 } from "lucide-react";

const typeRessources = [
  "ECRAN",
  "BATTERIE",
  "CARTE_MERE",
  "CAMERA",
  "HAUT_PARLEUR",
  "CONNECTEUR_CHARGE",
  "VITRE",
  "CHASSIS",
  "MEMOIRE_RAM",
  "DISQUE_DUR",
  "ALIMENTATION",
  "VENTILATEUR",
  "CLAVIER",
  "TRACKPAD",
  "AUTRE",
] as const;

const demontageSchema = z.object({
  articleSourceId: z.string().min(1, "Sélectionnez un article"),
  motif: z.string().optional(),
  notes: z.string().optional(),
  ressources: z
    .array(
      z.object({
        typeRessource: z.enum(typeRessources),
        nom: z.string().min(1, "Le nom est requis"),
        description: z.string().optional(),
        quantite: z.number().int().min(1),
        etat: z.enum(["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"]),
        marque: z.string().optional(),
        modele: z.string().optional(),
      })
    )
    .min(1, "Ajoutez au moins une pièce"),
});

type DemontageFormValues = z.infer<typeof demontageSchema>;

interface DemontageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DemontageDialog({
  open,
  onOpenChange,
  onSuccess,
}: DemontageDialogProps) {
  // Fetch occasion articles
  const { data: articles } = useQuery({
    queryKey: ["catalogue", "OCCASION"],
    queryFn: async () => {
      const response = await fetch("/api/catalogue?type=OCCASION&limit=100");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      return data.items;
    },
  });

  const form = useForm<DemontageFormValues>({
    resolver: zodResolver(demontageSchema),
    defaultValues: {
      articleSourceId: "",
      motif: "",
      notes: "",
      ressources: [
        {
          typeRessource: "ECRAN",
          nom: "",
          description: "",
          quantite: 1,
          etat: "BON",
          marque: "",
          modele: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ressources",
  });

  const createDemontage = useMutation({
    mutationFn: async (data: DemontageFormValues) => {
      const response = await fetch("/api/demontage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create demontage");
      return response.json();
    },
  });

  const onSubmit = (data: DemontageFormValues) => {
    createDemontage.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Nouveau démontage
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Article source */}
            <FormField
              control={form.control}
              name="articleSourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article à démonter</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionner un article d'occasion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articles?.map((article: any) => (
                        <SelectItem key={article.id} value={article.id}>
                          {article.reference} - {article.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motif */}
            <FormField
              control={form.control}
              name="motif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Récupération de pièces"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes supplémentaires..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ressources */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">Pièces récupérées</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      typeRessource: "AUTRE",
                      nom: "",
                      description: "",
                      quantite: 1,
                      etat: "BON",
                      marque: "",
                      modele: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une pièce
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] font-medium">
                      Pièce {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`ressources.${index}.typeRessource`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {typeRessources.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ressources.${index}.nom`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom de la pièce"
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
                      name={`ressources.${index}.etat`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>État</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="COMME_NEUF">
                                Comme neuf
                              </SelectItem>
                              <SelectItem value="TRES_BON">
                                Très bon
                              </SelectItem>
                              <SelectItem value="BON">Bon</SelectItem>
                              <SelectItem value="CORRECT">Correct</SelectItem>
                              <SelectItem value="POUR_PIECES">
                                Pour pièces
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ressources.${index}.quantite`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              className="h-11"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <PrimaryActionButton
                type="submit"
                disabled={createDemontage.isPending}
              >
                {createDemontage.isPending
                  ? "Démontage en cours..."
                  : "Démonter l'article"}
              </PrimaryActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
