"use client";

import { AuthError } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Bienvenue sur MyProPartner
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Configurons votre espace en quelques étapes
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <OnboardingStepper currentStep={step} steps={steps} />
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">
            {error && (
              <div className="mb-6">
                <AuthError error={error} />
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Étape 1: Informations de base */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Parlez-nous de votre entreprise
                      </h2>
                      <p className="text-muted-foreground">
                        Commençons par les informations essentielles
                      </p>
                    </div>

                    <Separator />

                    <FormField
                      control={form.control}
                      name="nomEntreprise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l&apos;entreprise *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Plomberie Dupont"
                              className="h-11"
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
                          <FormLabel>SIRET (optionnel)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="123 456 789 00012"
                              className="h-11"
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
                      <h2 className="text-2xl font-bold mb-2">
                        Quel est votre type d&apos;activité ?
                      </h2>
                      <p className="text-muted-foreground">
                        Nous allons configurer l&apos;application spécialement pour vous
                      </p>
                    </div>

                    <Separator />

                    {isLoadingTemplates ? (
                      <div className="flex items-center justify-center py-12">
                        <Spinner className="h-8 w-8" />
                      </div>
                    ) : (
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Liste des templates */}
                        <div className="lg:col-span-2 space-y-8">
                          {Object.entries(templates).map(
                            ([category, categoryTemplates]) => (
                              <div key={category} className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {category}
                                  </h3>
                                </div>
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

                        {/* Aperçu du template */}
                        <div className="lg:col-span-1">
                          {selectedTemplate ? (
                            <BusinessTemplatePreview template={selectedTemplate} />
                          ) : (
                            <Card className="border-dashed">
                              <CardContent className="p-8 text-center">
                                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                  Sélectionnez un type d&apos;activité pour voir un aperçu
                                  de la configuration
                                </p>
                              </CardContent>
                            </Card>
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
                      <h2 className="text-2xl font-bold mb-2">Derniers détails</h2>
                      <p className="text-muted-foreground">
                        Informations optionnelles pour compléter votre profil
                      </p>
                    </div>

                    <Separator />

                    <FormField
                      control={form.control}
                      name="adresse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="123 Rue de la République, 75001 Paris"
                              className="h-11"
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
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="01 23 45 67 89"
                              className="h-11"
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
                          <FormLabel>Secteur d&apos;activité détaillé (optionnel)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Plomberie chauffage sanitaire"
                              className="h-11"
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
                      <>
                        <Separator />
                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p className="font-semibold">
                                Configuration sélectionnée : {selectedTemplate.label}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                  {selectedTemplate.categories.length} catégories
                                </Badge>
                                {selectedTemplate.niveauxFidelite && (
                                  <Badge variant="secondary">
                                    {selectedTemplate.niveauxFidelite.length} niveaux de fidélité
                                  </Badge>
                                )}
                                {selectedTemplate.seriesDocuments && (
                                  <Badge variant="secondary">
                                    Numérotation automatique
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                  </div>
                )}

                <Separator />

                {/* Navigation buttons */}
                <div className="flex items-center justify-between">
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
                        className="gap-2"
                      >
                        Continuer
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading || !selectedTemplate}
                        className="gap-2 min-w-[180px]"
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
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Vous pourrez modifier toutes ces informations plus tard dans les paramètres
        </p>
      </div>
    </div>
  );
}
