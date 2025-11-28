"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCreateRachat } from "@/hooks/use-rachats";
import { useCategories } from "@/hooks/use-categories";
import { useFormReset } from "@/hooks/use-form-reset";
import {
  User,
  FileText,
  RotateCcw,
  DollarSign,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ClientStep } from "./steps/client-step";
import { ArticleInfoStep } from "./steps/article-info-step";
import { RachatDetailsStep } from "./steps/rachat-details-step";
import { PricingStockStep } from "./steps/pricing-stock-step";

// Validation schema
const rachatFormSchema = z.object({
  // Client (optional)
  clientId: z.string().optional(),

  // Article info
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  categorieId: z.string().min(1, "La catégorie est requise"),

  // Rachat details
  etat: z.enum(["COMME_NEUF", "TRES_BON", "BON", "CORRECT", "POUR_PIECES"]),
  provenance: z.enum([
    "RACHAT_CLIENT",
    "MARKETPLACE_OCCASION",
    "REPRISE",
    "DON",
    "RETOUR_SAV",
    "AUTRE",
  ]),
  prixRachat: z.number().positive("Le prix de rachat doit être supérieur à 0"),
  numeroSerie: z.string().optional(),
  notes: z.string().optional(),

  // Pricing & stock
  prix_ht: z.number().min(0, "Le prix HT doit être positif ou nul"),
  tva_taux: z.number().min(0).max(100),
  stock_actuel: z.number().int().min(0),
  stock_min: z.number().int().min(0),
});

type RachatFormValues = z.infer<typeof rachatFormSchema>;
type Step = 1 | 2 | 3 | 4;

interface RachatCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RachatCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: RachatCreateDialogProps) {
  const createRachat = useCreateRachat();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const defaultValues: RachatFormValues = {
    clientId: undefined,
    nom: "",
    description: "",
    categorieId: "",
    etat: "BON",
    provenance: "RACHAT_CLIENT",
    prixRachat: 1,
    numeroSerie: "",
    notes: "",
    prix_ht: 1,
    tva_taux: 20,
    stock_actuel: 1,
    stock_min: 0,
  };

  const form = useForm<RachatFormValues>({
    resolver: zodResolver(rachatFormSchema),
    defaultValues,
  });

  useFormReset(form, open, defaultValues);

  // Handle dialog open change - reset step when opening
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setCurrentStep(1);
    }
    onOpenChange(newOpen);
  };

  const steps = [
    { id: 1, name: "Client", icon: User },
    { id: 2, name: "Article", icon: FileText },
    { id: 3, name: "Rachat", icon: RotateCcw },
    { id: 4, name: "Prix & Stock", icon: DollarSign },
  ];

  const totalSteps = 4;

  const handleNext = async () => {
    let isValid = true;

    if (currentStep === 1) {
      // Client step - optional, always valid
      isValid = true;
    }

    if (currentStep === 2) {
      isValid = await form.trigger(["nom", "categorieId"]);
    }

    if (currentStep === 3) {
      isValid = await form.trigger([
        "etat",
        "provenance",
        "prixRachat",
      ]);
    }

    if (currentStep === 4) {
      isValid = await form.trigger(["prix_ht", "tva_taux", "stock_actuel", "stock_min"]);
    }

    if (isValid && currentStep < totalSteps) {
      setDirection("right");
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection("left");
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const onSubmit = (values: RachatFormValues) => {
    if (currentStep < totalSteps) return;

    // Transform data for API
    const rachatData = {
      articleData: {
        nom: values.nom,
        description: values.description || "",
        type: "OCCASION" as const,
        prix_ht: values.prix_ht,
        tva_taux: values.tva_taux,
        categorieId: values.categorieId,
        stock_actuel: values.stock_actuel,
        stock_min: values.stock_min,
        gestion_stock: true,
        actif: true,
      },
      clientId: values.clientId,
      prixRachat: values.prixRachat,
      etat: values.etat,
      provenance: values.provenance,
      numeroSerie: values.numeroSerie,
      notes: values.notes,
    };

    createRachat.mutate(rachatData, {
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
      },
      onError: (error) => {
        form.setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Une erreur est survenue",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold text-black tracking-[-0.02em]">
            Nouveau rachat
          </DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-black text-white"
                          : isActive
                            ? "bg-black text-white"
                            : "bg-black/5 text-black/30"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                      ) : (
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className={`text-[13px] mt-3 font-medium tracking-[-0.01em] transition-all duration-200 ${
                        isActive || isCompleted
                          ? "text-black"
                          : "text-black/40"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4 relative h-0.5">
                      <div className="absolute inset-0 bg-black/8 rounded-full" />
                      <div
                        className={`absolute inset-0 bg-black rounded-full transition-all duration-500 ease-out ${
                          currentStep > step.id ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentStep < totalSteps) {
                e.preventDefault();
              }
            }}
            className="space-y-6"
          >
            <div className="overflow-hidden min-h-[300px]">
              {currentStep === 1 && (
                <div
                  key="step-1"
                  className={`animate-in ${
                    direction === "right"
                      ? "slide-in-from-right"
                      : "slide-in-from-left"
                  } duration-300`}
                >
                  <ClientStep form={form} />
                </div>
              )}

              {currentStep === 2 && (
                <div
                  key="step-2"
                  className={`animate-in ${
                    direction === "right"
                      ? "slide-in-from-right"
                      : "slide-in-from-left"
                  } duration-300`}
                >
                  <ArticleInfoStep
                    form={form}
                    categories={categories}
                    loadingCategories={loadingCategories}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div
                  key="step-3"
                  className={`animate-in ${
                    direction === "right"
                      ? "slide-in-from-right"
                      : "slide-in-from-left"
                  } duration-300`}
                >
                  <RachatDetailsStep form={form} />
                </div>
              )}

              {currentStep === 4 && (
                <div
                  key="step-4"
                  className={`animate-in ${
                    direction === "right"
                      ? "slide-in-from-right"
                      : "slide-in-from-left"
                  } duration-300`}
                >
                  <PricingStockStep form={form} />
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-black/10 hover:bg-black/5"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}

              {currentStep < totalSteps ? (
                <PrimaryActionButton
                  type="button"
                  onClick={handleNext}
                  className="ml-auto"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </PrimaryActionButton>
              ) : (
                <PrimaryActionButton
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={createRachat.isPending}
                  className="ml-auto"
                >
                  {createRachat.isPending
                    ? "Enregistrement..."
                    : "Enregistrer le rachat"}
                </PrimaryActionButton>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
