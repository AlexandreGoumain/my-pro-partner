"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateArticle } from "@/hooks/use-articles";
import { articleCreateSchema, type ArticleCreateInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Archive,
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    FileText,
    FolderTree,
    Info,
    Package,
    Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CategoryTreeSelect } from "@/components/category-tree-select";

interface Category {
    id: string;
    nom: string;
    parentId: string | null;
    enfants?: Category[];
}

interface ArticleCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function ArticleCreateDialog({
    open,
    onOpenChange,
    onSuccess,
}: ArticleCreateDialogProps) {
    const router = useRouter();
    const createArticle = useCreateArticle();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [articleType, setArticleType] = useState<
        "PRODUIT" | "SERVICE" | null
    >(null);

    const form = useForm<ArticleCreateInput & { type: "PRODUIT" | "SERVICE" }>({
        resolver: zodResolver(articleCreateSchema),
        defaultValues: {
            reference: "",
            nom: "",
            description: "",
            type: "PRODUIT",
            prix_ht: 0,
            tva_taux: 20,
            categorieId: "",
            stock_actuel: 0,
            stock_min: 0,
            gestion_stock: false,
            actif: true,
        },
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoadingCategories(true);
                const response = await fetch("/api/categories");
                if (!response.ok)
                    throw new Error("Erreur chargement catégories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            setDirection("right");
            setArticleType(null);
            form.reset({
                reference: "",
                nom: "",
                description: "",
                type: "PRODUIT",
                prix_ht: 0,
                tva_taux: 20,
                categorieId: "",
                stock_actuel: 0,
                stock_min: 0,
                gestion_stock: false,
                actif: true,
            });
        }
    }, [open, form]);

    const steps = [
        { id: 1, name: "Type", icon: Tag },
        { id: 2, name: "Informations", icon: FileText },
        { id: 3, name: "Tarification", icon: DollarSign },
        ...(articleType === "PRODUIT"
            ? [{ id: 4, name: "Stock", icon: Archive }]
            : []),
        {
            id: articleType === "PRODUIT" ? 5 : 4,
            name: "Résumé",
            icon: CheckCircle2,
        },
    ];

    const totalSteps = articleType === "PRODUIT" ? 5 : 4;

    const handleNext = async () => {
        let isValid = true;

        if (currentStep === 1 && !articleType) {
            return;
        }

        if (currentStep === 2) {
            const fields = ["reference", "nom", "categorieId"] as const;
            isValid = await form.trigger(fields);
        }

        if (currentStep === 3) {
            isValid = await form.trigger(["prix_ht", "tva_taux"]);
        }

        if (currentStep === 4 && articleType === "PRODUIT") {
            isValid = await form.trigger(["stock_actuel", "stock_min"]);
        }

        if (isValid) {
            if (currentStep < totalSteps) {
                setDirection("right");
                setCurrentStep((prev) => (prev + 1) as Step);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setDirection("left");
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const handleTypeSelect = (type: "PRODUIT" | "SERVICE") => {
        setArticleType(type);
        form.setValue("type", type);
        if (type === "SERVICE") {
            form.setValue("stock_actuel", 0);
            form.setValue("stock_min", 0);
            form.setValue("gestion_stock", false);
        }
    };

    function onSubmit(
        values: ArticleCreateInput & { type: "PRODUIT" | "SERVICE" }
    ) {
        createArticle.mutate(values, {
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
    }

    const prixTTC = form.watch("prix_ht") * (1 + form.watch("tva_taux") / 100);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! sm:max-w-6xl! w-[95vw] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Créer un nouveau{" "}
                        {articleType === "SERVICE" ? "service" : "produit"}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center flex-1"
                                >
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                                isCompleted
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : isActive
                                                    ? "border-primary text-primary bg-primary/10"
                                                    : "border-muted-foreground/30 text-muted-foreground"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs mt-2 font-medium ${
                                                isActive
                                                    ? "text-primary"
                                                    : isCompleted
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-2 transition-all ${
                                                currentStep > step.id
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/30"
                                            }`}
                                        />
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
                        className="space-y-6"
                    >
                        <div className="overflow-hidden">
                            {currentStep === 1 && (
                                <div
                                    key="step-1"
                                    className={`space-y-6 py-4 animate-in ${
                                        direction === "right"
                                            ? "slide-in-from-right"
                                            : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Quel type d&apos;article souhaitez-vous
                                            créer ?
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Choisissez si vous vendez un produit
                                            physique ou un service
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                    <Card
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                            articleType === "PRODUIT"
                                                ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                                                : "border-muted hover:border-blue-300"
                                        }`}
                                        onClick={() =>
                                            handleTypeSelect("PRODUIT")
                                        }
                                    >
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex justify-center">
                                                <div
                                                    className={`p-4 rounded-full ${
                                                        articleType ===
                                                        "PRODUIT"
                                                            ? "bg-blue-500"
                                                            : "bg-blue-100"
                                                    }`}
                                                >
                                                    <Package
                                                        className={`h-12 w-12 ${
                                                            articleType ===
                                                            "PRODUIT"
                                                                ? "text-white"
                                                                : "text-blue-600"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h4 className="font-semibold text-lg">
                                                    Produit
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Article physique avec
                                                    gestion de stock
                                                </p>
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>Suivi du stock</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        Alertes de
                                                        réapprovisionnement
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        Mouvements de stock
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                            articleType === "SERVICE"
                                                ? "border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20"
                                                : "border-muted hover:border-purple-300"
                                        }`}
                                        onClick={() =>
                                            handleTypeSelect("SERVICE")
                                        }
                                    >
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex justify-center">
                                                <div
                                                    className={`p-4 rounded-full ${
                                                        articleType ===
                                                        "SERVICE"
                                                            ? "bg-purple-500"
                                                            : "bg-purple-100"
                                                    }`}
                                                >
                                                    <Briefcase
                                                        className={`h-12 w-12 ${
                                                            articleType ===
                                                            "SERVICE"
                                                                ? "text-white"
                                                                : "text-purple-600"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h4 className="font-semibold text-lg">
                                                    Service
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Prestation ou service sans
                                                    stock
                                                </p>
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        Pas de gestion de stock
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        Facturation simplifiée
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>
                                                        Tarification flexible
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div
                                    key="step-2"
                                    className={`space-y-6 py-4 animate-in ${
                                        direction === "right"
                                            ? "slide-in-from-right"
                                            : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Informations générales
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Renseignez les informations de base
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="reference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Référence *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={
                                                            articleType ===
                                                            "SERVICE"
                                                                ? "SRV-001"
                                                                : "PRD-001"
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Identifiant unique
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categorieId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Catégorie *
                                                </FormLabel>
                                                <FormControl>
                                                    {categories.length === 0 ? (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30">
                                                                <FolderTree className="h-10 w-10 text-muted-foreground mb-3" />
                                                                <p className="text-sm text-muted-foreground text-center mb-3">
                                                                    Aucune catégorie disponible
                                                                </p>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        onOpenChange(false);
                                                                        router.push("/dashboard/articles/categories");
                                                                    }}
                                                                >
                                                                    <FolderTree className="h-4 w-4 mr-2" />
                                                                    Créer mes catégories
                                                                </Button>
                                                            </div>
                                                            <Card className="border-amber-200 bg-amber-50/50">
                                                                <CardContent className="p-3">
                                                                    <div className="flex gap-2">
                                                                        <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                                                        <p className="text-xs text-amber-700">
                                                                            Commencez par créer vos catégories pour mieux organiser votre catalogue. Nous vous montrerons des exemples !
                                                                        </p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    ) : (
                                                        <CategoryTreeSelect
                                                            categories={categories}
                                                            value={field.value || ""}
                                                            onValueChange={field.onChange}
                                                            disabled={loadingCategories}
                                                        />
                                                    )}
                                                </FormControl>
                                                {categories.length > 0 && (
                                                    <div className="flex items-center justify-between">
                                                        <FormDescription>
                                                            Utilisez l&apos;arborescence pour naviguer
                                                        </FormDescription>
                                                        <Button
                                                            type="button"
                                                            variant="link"
                                                            size="sm"
                                                            className="h-auto p-0 text-xs"
                                                            onClick={() => {
                                                                onOpenChange(false);
                                                                router.push("/dashboard/articles/categories");
                                                            }}
                                                        >
                                                            <FolderTree className="h-3 w-3 mr-1" />
                                                            Gérer les catégories
                                                        </Button>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        articleType ===
                                                        "SERVICE"
                                                            ? "Ex: Installation électrique"
                                                            : "Ex: Tournevis électrique"
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Description détaillée..."
                                                    className="resize-none"
                                                    rows={4}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Décrivez le{" "}
                                                {articleType === "SERVICE"
                                                    ? "service"
                                                    : "produit"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div
                                    key="step-3"
                                    className={`space-y-6 py-4 animate-in ${
                                        direction === "right"
                                            ? "slide-in-from-right"
                                            : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Tarification
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Définissez le prix de vente
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="prix_ht"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prix HT *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Prix hors taxes en €
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tva_taux"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Taux TVA *
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            parseFloat(value)
                                                        )
                                                    }
                                                    defaultValue={field.value.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">
                                                            0%
                                                        </SelectItem>
                                                        <SelectItem value="5.5">
                                                            5,5%
                                                        </SelectItem>
                                                        <SelectItem value="10">
                                                            10%
                                                        </SelectItem>
                                                        <SelectItem value="20">
                                                            20%
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Taux de TVA
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    </div>

                                    {form.watch("prix_ht") > 0 && (
                                        <Card className="bg-primary/5 border-primary/20">
                                        <CardContent className="p-6 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">
                                                    Prix HT
                                                </span>
                                                <span className="font-semibold">
                                                    {form
                                                        .watch("prix_ht")
                                                        .toFixed(2)}{" "}
                                                    €
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">
                                                    TVA (
                                                    {form.watch("tva_taux")}%)
                                                </span>
                                                <span className="font-semibold">
                                                    {(
                                                        form.watch("prix_ht") *
                                                        (form.watch(
                                                            "tva_taux"
                                                        ) /
                                                            100)
                                                    ).toFixed(2)}{" "}
                                                    €
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="font-semibold">
                                                    Prix TTC
                                                </span>
                                                <span className="text-2xl font-bold text-primary">
                                                    {prixTTC.toFixed(2)} €
                                                </span>
                                            </div>
                                        </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {currentStep === 4 && articleType === "PRODUIT" && (
                                <div
                                    key="step-4"
                                    className={`space-y-6 py-4 animate-in ${
                                        direction === "right"
                                            ? "slide-in-from-right"
                                            : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Gestion du stock
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Configurez le stock initial et les
                                            alertes
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="stock_actuel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Stock initial
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Quantité en stock
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock_min"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Seuil d&apos;alerte
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Stock minimum avant alerte
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    </div>

                                    <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    À propos du seuil
                                                    d&apos;alerte
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vous recevrez une
                                                    notification lorsque le
                                                    stock atteindra ou passera
                                                    sous ce seuil.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    </Card>

                                    <FormField
                                    control={form.control}
                                    name="gestion_stock"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Activer la gestion
                                                    automatique du stock
                                                </FormLabel>
                                                <FormDescription>
                                                    Le stock sera
                                                    automatiquement déduit lors
                                                    des ventes
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                </div>
                            )}

                            {((currentStep === 5 && articleType === "PRODUIT") ||
                                (currentStep === 4 &&
                                    articleType === "SERVICE")) && (
                                <div
                                    key="step-5"
                                    className={`space-y-6 py-4 animate-in ${
                                        direction === "right"
                                            ? "slide-in-from-right"
                                            : "slide-in-from-left"
                                    } duration-300`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            Résumé et confirmation
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Vérifiez les informations avant de créer
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-full ${
                                                        articleType ===
                                                        "SERVICE"
                                                            ? "bg-purple-100"
                                                            : "bg-blue-100"
                                                    }`}
                                                >
                                                    {articleType ===
                                                    "SERVICE" ? (
                                                        <Briefcase className="h-5 w-5 text-purple-600" />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Type
                                                    </p>
                                                    <p className="font-semibold">
                                                        {articleType ===
                                                        "SERVICE"
                                                            ? "Service"
                                                            : "Produit"}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        articleType ===
                                                        "SERVICE"
                                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                                    }
                                                >
                                                    {articleType}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">
                                                Informations générales
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Référence:
                                                    </span>
                                                    <p className="font-medium">
                                                        {form.watch(
                                                            "reference"
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Catégorie:
                                                    </span>
                                                    <p className="font-medium">
                                                        {categories.find(
                                                            (c) =>
                                                                c.id ===
                                                                form.watch(
                                                                    "categorieId"
                                                                )
                                                        )?.nom || "-"}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Nom:
                                                    </span>
                                                    <p className="font-medium">
                                                        {form.watch("nom")}
                                                    </p>
                                                </div>
                                                {form.watch("description") && (
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">
                                                            Description:
                                                        </span>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {form.watch(
                                                                "description"
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">
                                                Tarification
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Prix HT
                                                    </span>
                                                    <span className="font-semibold">
                                                        {form
                                                            .watch("prix_ht")
                                                            .toFixed(2)}{" "}
                                                        €
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        TVA (
                                                        {form.watch("tva_taux")}
                                                        %)
                                                    </span>
                                                    <span className="font-semibold">
                                                        {(
                                                            form.watch(
                                                                "prix_ht"
                                                            ) *
                                                            (form.watch(
                                                                "tva_taux"
                                                            ) /
                                                                100)
                                                        ).toFixed(2)}{" "}
                                                        €
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">
                                                        Prix TTC
                                                    </span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {prixTTC.toFixed(2)} €
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {articleType === "PRODUIT" && (
                                        <Card>
                                            <CardContent className="p-4 space-y-3">
                                                <h4 className="font-semibold text-sm">
                                                    Stock
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Stock initial:
                                                        </span>
                                                        <p className="font-medium">
                                                            {form.watch(
                                                                "stock_actuel"
                                                            )}{" "}
                                                            unités
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Seuil d&apos;alerte:
                                                        </span>
                                                        <p className="font-medium">
                                                            {form.watch(
                                                                "stock_min"
                                                            )}{" "}
                                                            unités
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">
                                                            Gestion auto:
                                                        </span>
                                                        <p className="font-medium">
                                                            {form.watch(
                                                                "gestion_stock"
                                                            )
                                                                ? "Activée"
                                                                : "Désactivée"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="actif"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Activer immédiatement cet
                                                        article
                                                    </FormLabel>
                                                    <FormDescription>
                                                        L&apos;article sera visible
                                                        dans le catalogue
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {form.formState.errors.root && (
                            <div className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={
                                    currentStep === 1 || createArticle.isPending
                                }
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Précédent
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={currentStep === 1 && !articleType}
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <ButtonWithSpinner
                                    type="submit"
                                    isLoading={createArticle.isPending}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Créer{" "}
                                    {articleType === "SERVICE"
                                        ? "le service"
                                        : "le produit"}
                                </ButtonWithSpinner>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
