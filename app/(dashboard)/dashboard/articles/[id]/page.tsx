"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleDisplay } from "@/lib/types/article";
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    ArrowLeft,
    BarChart3,
    Briefcase,
    CheckCircle2,
    Clock,
    Copy,
    DollarSign,
    Download,
    Edit,
    Eye,
    EyeOff,
    FileText,
    MoreVertical,
    Package,
    RotateCcw,
    Share2,
    ShoppingCart,
    Trash2,
    TrendingDown,
    TrendingUp,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ArticleDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface MouvementStock {
    id: string;
    type: "ENTREE" | "SORTIE" | "AJUSTEMENT" | "INVENTAIRE" | "RETOUR";
    quantite: number;
    stock_avant: number;
    stock_apres: number;
    motif?: string;
    reference?: string;
    createdAt: string;
}

interface ArticleStats {
    ventesTotal: number;
    ventesMois: number;
    ventesEvolution: number;
    ca_total: number;
    ca_mois: number;
    ca_evolution: number;
    marge_moyenne: number;
    rotationStock: number;
    derniereMaj: string;
}

interface DocumentLie {
    id: string;
    numero: string;
    type: "DEVIS" | "FACTURE" | "AVOIR";
    client: string;
    quantite: number;
    montant: number;
    date: string;
    statut: string;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const router = useRouter();
    const [article, setArticle] = useState<ArticleDisplay | null>(null);
    const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
    const [stats, setStats] = useState<ArticleStats | null>(null);
    const [documents, setDocuments] = useState<DocumentLie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [articleId, setArticleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setArticleId(resolvedParams.id);
        };
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!articleId) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch article details
                const articleRes = await fetch(`/api/articles/${articleId}`);
                if (articleRes.ok) {
                    const data = await articleRes.json();
                    const articleDisplay: ArticleDisplay = {
                        id: data.id,
                        reference: data.reference,
                        nom: data.nom,
                        description: data.description,
                        type: data.type || "PRODUIT",
                        prix: Number(data.prix_ht),
                        stock: data.stock_actuel,
                        seuilAlerte: data.stock_min,
                        categorie: data.categorie?.nom || "Sans catégorie",
                        statut: data.statut,
                        image: data.image,
                        tva: data.tva_taux,
                    };
                    setArticle(articleDisplay);
                }

                // Fetch stock movements (mock for now)
                // TODO: Create API endpoint
                setMouvements([]);

                // Fetch stats (mock for now)
                // TODO: Create API endpoint
                setStats({
                    ventesTotal: 145,
                    ventesMois: 12,
                    ventesEvolution: 8.5,
                    ca_total: 24580,
                    ca_mois: 2040,
                    ca_evolution: 12.3,
                    marge_moyenne: 35.5,
                    rotationStock: 2.3,
                    derniereMaj: new Date().toISOString(),
                });

                // Fetch related documents (mock for now)
                // TODO: Create API endpoint
                setDocuments([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [articleId]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
                    <h1 className="text-2xl font-bold">Article non trouvé</h1>
                    <p className="text-gray-500">
                        L&apos;article que vous recherchez n&apos;existe pas ou
                        a été supprimé.
                    </p>
                    <Button onClick={() => router.push("/dashboard/articles")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour au catalogue
                    </Button>
                </div>
            </div>
        );
    }

    const prixTTC = article.prix * (1 + article.tva / 100);
    const isLowStock = article.stock <= article.seuilAlerte;
    const stockPercentage =
        article.seuilAlerte > 0
            ? Math.min((article.stock / (article.seuilAlerte * 3)) * 100, 100)
            : 100;
    const isService = article.type === "SERVICE";

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case "ACTIF":
                return (
                    <Badge className="bg-green-500 gap-1.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Actif
                    </Badge>
                );
            case "INACTIF":
                return (
                    <Badge variant="secondary" className="gap-1.5">
                        <EyeOff className="h-3 w-3" />
                        Inactif
                    </Badge>
                );
            case "RUPTURE":
                return (
                    <Badge variant="destructive" className="gap-1.5">
                        <XCircle className="h-3 w-3" />
                        Rupture de stock
                    </Badge>
                );
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    const getMouvementIcon = (type: string) => {
        switch (type) {
            case "ENTREE":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "SORTIE":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case "AJUSTEMENT":
                return <RotateCcw className="h-4 w-4 text-blue-600" />;
            case "INVENTAIRE":
                return <BarChart3 className="h-4 w-4 text-purple-600" />;
            case "RETOUR":
                return <RotateCcw className="h-4 w-4 text-amber-600" />;
            default:
                return <Package className="h-4 w-4 text-gray-600" />;
        }
    };

    const getMouvementLabel = (type: string) => {
        const labels = {
            ENTREE: "Entrée",
            SORTIE: "Sortie",
            AJUSTEMENT: "Ajustement",
            INVENTAIRE: "Inventaire",
            RETOUR: "Retour",
        };
        return labels[type as keyof typeof labels] || type;
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard/articles")}
                        className="gap-2 -ml-2 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour au catalogue
                    </Button>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {article.nom}
                        </h1>
                        <Badge
                            className={
                                isService ? "bg-purple-500" : "bg-blue-500"
                            }
                        >
                            {isService ? (
                                <>
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    Service
                                </>
                            ) : (
                                <>
                                    <Package className="h-3 w-3 mr-1" />
                                    Produit
                                </>
                            )}
                        </Badge>
                        {getStatusBadge(article.statut)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Réf. {article.reference} • {article.categorie}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Copy className="h-4 w-4" />
                        Dupliquer
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Exporter les données
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                {article.statut === "ACTIF" ? (
                                    <>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Désactiver
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Activer
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Alerts */}
            {!isService && isLowStock && article.statut !== "RUPTURE" && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-amber-900">
                                    Alerte stock faible
                                </p>
                                <p className="text-sm text-amber-700">
                                    Le stock actuel ({article.stock} unités) est
                                    inférieur ou égal au seuil d&apos;alerte (
                                    {article.seuilAlerte} unités). Pensez à
                                    réapprovisionner.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0"
                            >
                                Commander
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* KPI Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                {isService
                                    ? "Prestations (mois)"
                                    : "Ventes (mois)"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-bold">
                                    {stats.ventesMois}
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600 font-medium">
                                        +{stats.ventesEvolution}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.ventesTotal} total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                CA (mois)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-bold">
                                    {stats.ca_mois.toLocaleString()}€
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600 font-medium">
                                        +{stats.ca_evolution}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.ca_total.toLocaleString()}€ total
                            </p>
                        </CardContent>
                    </Card>

                    {!isService && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Stock actuel
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline justify-between">
                                    <div className="text-2xl font-bold">
                                        {article.stock}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        /{article.seuilAlerte} min
                                    </div>
                                </div>
                                <Progress
                                    value={stockPercentage}
                                    className="mt-2 h-1.5"
                                />
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Marge moyenne
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <div className="text-2xl font-bold">
                                    {stats.marge_moyenne}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {!isService &&
                                        `Rotation: ${stats.rotationStock}x`}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Très bonne rentabilité
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <TabsList
                    className={`grid w-full ${
                        isService ? "grid-cols-4" : "grid-cols-5"
                    }`}
                >
                    <TabsTrigger value="overview">
                        Vue d&apos;ensemble
                    </TabsTrigger>
                    {!isService && (
                        <TabsTrigger value="stock">Stock</TabsTrigger>
                    )}
                    <TabsTrigger value="sales">
                        {isService ? "Prestations" : "Ventes"}
                    </TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Image and basic info */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.nom}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-24 w-24 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Changer l&apos;image
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Référence
                                            </span>
                                            <span className="font-mono font-semibold">
                                                {article.reference}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Catégorie
                                            </span>
                                            <span className="font-medium">
                                                {article.categorie}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Statut
                                            </span>
                                            {getStatusBadge(article.statut)}
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Unité
                                            </span>
                                            <span className="font-medium">
                                                unité
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column - Details */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {article.description ||
                                            "Aucune description disponible"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tarification</CardTitle>
                                    <CardDescription>
                                        Prix de vente et calculs automatiques
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Prix HT
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {article.prix.toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                TVA
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {article.tva}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                +
                                                {(
                                                    prixTTC - article.prix
                                                ).toFixed(2)}{" "}
                                                €
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Prix TTC
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                {prixTTC.toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Prix unitaire HT
                                            </span>
                                            <span className="font-semibold">
                                                {article.prix.toFixed(2)} €
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Montant TVA
                                            </span>
                                            <span className="font-semibold">
                                                {(
                                                    prixTTC - article.prix
                                                ).toFixed(2)}{" "}
                                                €
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                                            <span>Prix de vente TTC</span>
                                            <span className="text-primary">
                                                {prixTTC.toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {!isService && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Gestion du stock</CardTitle>
                                        <CardDescription>
                                            Suivi et alertes de disponibilité
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Stock actuel
                                                </p>
                                                <p className="text-4xl font-bold">
                                                    {article.stock}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    unités disponibles
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Seuil d&apos;alerte
                                                </p>
                                                <p className="text-4xl font-bold text-muted-foreground">
                                                    {article.seuilAlerte}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    unités minimum
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Niveau
                                                </span>
                                                <Progress
                                                    value={stockPercentage}
                                                    className="w-1/2 h-2"
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Disponibilité
                                                </span>
                                                <span
                                                    className={`font-semibold ${
                                                        article.stock >
                                                        article.seuilAlerte
                                                            ? "text-green-600"
                                                            : article.stock > 0
                                                            ? "text-amber-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {article.stock >
                                                    article.seuilAlerte
                                                        ? "En stock"
                                                        : article.stock > 0
                                                        ? "Stock limité"
                                                        : "Rupture"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Gestion stock
                                                </span>
                                                <span className="font-semibold">
                                                    Activée
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            <Package className="h-4 w-4 mr-2" />
                                            Ajuster le stock
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Stock Tab */}
                <TabsContent value="stock" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Mouvements de stock</CardTitle>
                                    <CardDescription>
                                        Historique complet des entrées et
                                        sorties
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Package className="h-4 w-4 mr-2" />
                                    Nouveau mouvement
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {mouvements.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground">
                                        Aucun mouvement de stock enregistré
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {mouvements.map((mouvement) => (
                                        <div
                                            key={mouvement.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getMouvementIcon(
                                                    mouvement.type
                                                )}
                                                <div>
                                                    <p className="font-medium">
                                                        {getMouvementLabel(
                                                            mouvement.type
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {mouvement.motif ||
                                                            "Aucun motif"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {mouvement.quantite > 0
                                                        ? "+"
                                                        : ""}
                                                    {mouvement.quantite}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Stock:{" "}
                                                    {mouvement.stock_apres}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyse des ventes</CardTitle>
                            <CardDescription>
                                Performance et statistiques de vente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    Les statistiques de vente seront bientôt
                                    disponibles
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents liés</CardTitle>
                            <CardDescription>
                                Devis et factures utilisant cet article
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {documents.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground">
                                        Aucun document lié à cet article
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {doc.type} {doc.numero}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {doc.client}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {doc.montant.toFixed(2)} €
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    x{doc.quantite}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline d&apos;activité</CardTitle>
                            <CardDescription>
                                Historique complet des modifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    L&apos;historique des modifications sera
                                    bientôt disponible
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
