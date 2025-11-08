"use client";

import { AuthError } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useOnboardingPage } from "@/hooks/use-onboarding-page";
import { useBusinessTemplateSelection } from "@/hooks/use-business-template-selection";
import { cn } from "@/lib/utils";
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { BusinessTemplateCard } from "@/components/onboarding/business-template-card";
import { BusinessTemplatePreview } from "@/components/onboarding/business-template-preview";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const {
    form,
    isLoading,
    error,
    onSubmit,
    step,
    nextStep,
    prevStep,
    canGoNext,
  } = useOnboardingPage();

  const { templates, isLoading: isLoadingTemplates, selectedTemplate, setSelectedTemplate } =
    useBusinessTemplateSelection();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const steps = [
    {
      number: 1,
      title: "Votre entreprise",
      description: "Informations de base",
    },
    {
      number: 2,
      title: "Type d'activité",
      description: "Personnalisation",
    },
    {
      number: 3,
      title: "Finalisation",
      description: "Informations complémentaires",
    },
  ];

  // Auto-sélectionner la première catégorie si disponible
  useEffect(() => {
    if (!selectedCategory && Object.keys(templates).length > 0) {
      setSelectedCategory(Object.keys(templates)[0]);
    }
  }, [templates, selectedCategory]);

  // Synchroniser le template sélectionné avec le formulaire
  useEffect(() => {
    if (selectedTemplate) {
      form.setValue("businessType", selectedTemplate.type);
    }
  }, [selectedTemplate, form]);

  const handleNext = () => {
    if (step === 1 && canGoNext) {
      nextStep();
    } else if (step === 2 && selectedTemplate) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white text-2xl font-bold mb-4 shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Bienvenue sur MyProPartner
          </h1>
          <p className="text-black/60">
            Configurons votre espace en quelques étapes
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <OnboardingStepper currentStep={step} steps={steps} />
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AuthError error={error} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Étape 1: Informations de base */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Parlez-nous de votre entreprise
                    </h2>
                    <p className="text-black/60">
                      Commençons par les informations essentielles
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="nomEntreprise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] font-medium">
                          Nom de l&apos;entreprise *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Plomberie Dupont"
                            className={cn(
                              "h-12 text-[15px]",
                              form.formState.errors.nomEntreprise &&
                                "border-red-500"
                            )}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] font-medium">
                          SIRET (optionnel)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123 456 789 00012"
                            className="h-12 text-[15px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Nécessaire pour l&apos;export FEC comptable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Étape 2: Sélection du type d'activité */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Quel est votre type d&apos;activité ?
                    </h2>
                    <p className="text-black/60">
                      Nous allons configurer l&apos;application spécialement
                      pour vous
                    </p>
                  </div>

                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center py-12">
                      <Spinner className="h-8 w-8" />
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Liste des catégories */}
                      <div className="lg:col-span-2 space-y-6">
                        {Object.entries(templates).map(
                          ([category, categoryTemplates]) => (
                            <div key={category} className="space-y-3">
                              <h3 className="text-[14px] font-semibold text-black/70 uppercase tracking-wide">
                                {category}
                              </h3>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {categoryTemplates.map((template) => (
                                  <BusinessTemplateCard
                                    key={template.type}
                                    template={template}
                                    isSelected={
                                      selectedTemplate?.type === template.type
                                    }
                                    onSelect={() => {
                                      setSelectedTemplate(template);
                                      form.setValue("businessType", template.type);
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Aperçu du template sélectionné */}
                      <div className="lg:sticky lg:top-6 h-fit">
                        {selectedTemplate ? (
                          <BusinessTemplatePreview template={selectedTemplate} />
                        ) : (
                          <div className="rounded-xl border border-dashed border-black/20 bg-black/5 p-8 text-center">
                            <p className="text-[14px] text-black/60">
                              Sélectionnez un type d&apos;activité pour voir un
                              aperçu de la configuration
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 3: Informations complémentaires */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Derniers détails
                    </h2>
                    <p className="text-black/60">
                      Informations optionnelles pour compléter votre profil
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] font-medium">
                          Adresse
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123 Rue de la République, 75001 Paris"
                            className="h-12 text-[15px]"
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
                        <FormLabel className="text-[14px] font-medium">
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="01 23 45 67 89"
                            className="h-12 text-[15px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secteur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] font-medium">
                          Secteur d&apos;activité détaillé (optionnel)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Plomberie chauffage sanitaire"
                            className="h-12 text-[15px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Pour mieux personnaliser votre expérience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Récapitulatif */}
                  {selectedTemplate && (
                    <div className="mt-8 p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-[13px] text-green-900">
                        ✅ <strong>Configuration sélectionnée :</strong>{" "}
                        {selectedTemplate.label}
                        <br />
                        <span className="text-green-700">
                          {selectedTemplate.categories.length} catégories,{" "}
                          {selectedTemplate.niveauxFidelite?.length || 0}{" "}
                          niveaux de fidélité seront créés automatiquement.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-black/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 1 || isLoading}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>

                <div className="flex gap-3">
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (step === 1 && !canGoNext) ||
                        (step === 2 && !selectedTemplate)
                      }
                      className="gap-2 bg-black hover:bg-black/90"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !selectedTemplate}
                      className="gap-2 bg-black hover:bg-black/90 min-w-[180px]"
                    >
                      {isLoading ? (
                        <>
                          <Spinner className="h-4 w-4" />
                          Configuration...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Lancer l&apos;application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-black/40 mt-6">
          Vous pourrez modifier toutes ces informations plus tard dans les
          paramètres
        </p>
      </div>
    </div>
  );
}
