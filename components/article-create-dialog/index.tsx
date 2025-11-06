"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCreateArticle } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { articleCreateSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, CheckCircle2, ChevronLeft, ChevronRight, DollarSign, FileText, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TypeSelectionStep } from "./steps/type-selection-step";
import { InfoStep } from "./steps/info-step";
import { PricingStep } from "./steps/pricing-step";
import { StockStep } from "./steps/stock-step";
import { SummaryStep } from "./steps/summary-step";
import { ArticleFormValues, ArticleType, Direction, Step } from "./types";

interface ArticleCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ArticleCreateDialog({ open, onOpenChange, onSuccess }: ArticleCreateDialogProps) {
    const router = useRouter();
    const createArticle = useCreateArticle();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();

    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [direction, setDirection] = useState<Direction>("right");
    const [articleType, setArticleType] = useState<ArticleType | null>(null);

    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleCreateSchema),
        defaultValues: {
            nom: "",
            description: "",
            type: "PRODUIT",
            prix_ht: 0,
            tva_taux: 20,
            categorieId: "",
            stock_actuel: 0,
            stock_min: 0,
            gestion_stock: true,
            actif: true,
        },
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            setArticleType(null);
            form.reset({
                nom: "",
                description: "",
                type: "PRODUIT",
                prix_ht: 0,
                tva_taux: 20,
                categorieId: "",
                stock_actuel: 0,
                stock_min: 0,
                gestion_stock: true,
                actif: true,
            });
        }
    }, [open, form]);

    const steps = [
        { id: 1, name: "Type", icon: Tag },
        { id: 2, name: "Informations", icon: FileText },
        { id: 3, name: "Tarification", icon: DollarSign },
        ...(articleType === "PRODUIT" ? [{ id: 4, name: "Stock", icon: Archive }] : []),
        { id: articleType === "PRODUIT" ? 5 : 4, name: "Résumé", icon: CheckCircle2 },
    ];

    const totalSteps = articleType === "PRODUIT" ? 5 : 4;

    const handleNext = async () => {
        let isValid = true;

        if (currentStep === 1 && !articleType) return;

        if (currentStep === 2) {
            const fields = ["nom", "categorieId"] as const;
            isValid = await form.trigger(fields);
        }

        if (currentStep === 3) {
            isValid = await form.trigger(["prix_ht", "tva_taux"]);
        }

        if (currentStep === 4 && articleType === "PRODUIT") {
            isValid = await form.trigger(["stock_actuel", "stock_min"]);
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

    const handleTypeSelect = (type: ArticleType) => {
        setArticleType(type);
        form.setValue("type", type);
        if (type === "SERVICE") {
            form.setValue("stock_actuel", 0);
            form.setValue("stock_min", 0);
            form.setValue("gestion_stock", false);
        }
    };

    const handleNavigateToCategories = () => {
        onOpenChange(false);
        router.push("/dashboard/articles/categories");
    };

    function onSubmit(values: ArticleFormValues) {
        // Empêcher le submit si on n'est pas au dernier step (résumé)
        if (currentStep < totalSteps) {
            return;
        }

        createArticle.mutate(values, {
            onSuccess: () => {
                onSuccess();
                onOpenChange(false);
            },
            onError: (error) => {
                form.setError("root", {
                    message: error instanceof Error ? error.message : "Une erreur est survenue",
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl sm:max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Créer un nouveau {articleType === "SERVICE" ? "service" : "produit"}
                    </DialogTitle>
                </DialogHeader>

                {/* Steps indicator */}
                <div className="py-8">
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
                                                isActive || isCompleted ? "text-black" : "text-black/40"
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
                            // Empêcher le submit avec Enter si on n'est pas au dernier step
                            if (e.key === "Enter" && currentStep < totalSteps) {
                                e.preventDefault();
                            }
                        }}
                        className="space-y-6"
                    >
                        <div className="overflow-hidden">
                            {currentStep === 1 && (
                                <div
                                    key="step-1"
                                    className={`animate-in ${
                                        direction === "right" ? "slide-in-from-right" : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <TypeSelectionStep
                                        form={form}
                                        articleType={articleType}
                                        onTypeSelect={handleTypeSelect}
                                        categories={categories}
                                        loadingCategories={loadingCategories}
                                    />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div
                                    key="step-2"
                                    className={`animate-in ${
                                        direction === "right" ? "slide-in-from-right" : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <InfoStep
                                        form={form}
                                        articleType={articleType}
                                        categories={categories}
                                        loadingCategories={loadingCategories}
                                        onNavigateToCategories={handleNavigateToCategories}
                                    />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div
                                    key="step-3"
                                    className={`animate-in ${
                                        direction === "right" ? "slide-in-from-right" : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <PricingStep
                                        form={form}
                                        articleType={articleType}
                                        categories={categories}
                                        loadingCategories={loadingCategories}
                                    />
                                </div>
                            )}

                            {currentStep === 4 && articleType === "PRODUIT" && (
                                <div
                                    key="step-4"
                                    className={`animate-in ${
                                        direction === "right" ? "slide-in-from-right" : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <StockStep
                                        form={form}
                                        articleType={articleType}
                                        categories={categories}
                                        loadingCategories={loadingCategories}
                                    />
                                </div>
                            )}

                            {((currentStep === 5 && articleType === "PRODUIT") ||
                                (currentStep === 4 && articleType === "SERVICE")) && (
                                <div
                                    key="step-5"
                                    className={`animate-in ${
                                        direction === "right" ? "slide-in-from-right" : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <SummaryStep
                                        form={form}
                                        articleType={articleType}
                                        categories={categories}
                                        loadingCategories={loadingCategories}
                                    />
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
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={currentStep === 1 && !articleType}
                                    className="bg-black hover:bg-black/90 text-white ml-auto"
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    disabled={createArticle.isPending}
                                    className="bg-black hover:bg-black/90 text-white ml-auto"
                                >
                                    {createArticle.isPending ? "Création..." : "Créer l'article"}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
