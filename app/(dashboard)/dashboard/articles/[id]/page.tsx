"use client";

import { ArticleDetailHeader } from "@/components/articles/article-detail-header";
import { ArticleDetailKPIs } from "@/components/articles/article-detail-kpis";
import { ArticleLowStockAlert } from "@/components/articles/article-low-stock-alert";
import {
    MouvementStockIcon,
    getMouvementLabel,
} from "@/components/articles/mouvement-stock-icon";
import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card-section";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticleDetail } from "@/hooks/use-article-detail";
import {
    AlertCircle,
    ArrowLeft,
    BarChart3,
    Clock,
    Download,
    FileText,
    Package,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ArticleDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const router = useRouter();
    const [articleId, setArticleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setArticleId(resolvedParams.id);
        };
        resolveParams();
    }, [params]);

    const { article, mouvements, stats, documents, isLoading } =
        useArticleDetail(articleId);

    const prixTTC = useMemo(
        () => (article ? article.prix * (1 + article.tva / 100) : 0),
        [article]
    );

    const isLowStock = useMemo(
        () => (article ? article.stock <= article.seuilAlerte : false),
        [article]
    );

    const stockPercentage = useMemo(() => {
        if (!article || article.seuilAlerte === 0) return 100;
        return Math.min((article.stock / (article.seuilAlerte * 3)) * 100, 100);
    }, [article]);

    const isService = useMemo(() => article?.type === "SERVICE", [article]);

    if (isLoading) {
        return (
            <PageSkeleton
                layout="stats-grid"
                statsCount={4}
                gridColumns={2}
                itemCount={4}
                withTabs={true}
                tabsCount={5}
                statsHeight="h-32"
                itemHeight="h-80"
            />
        );
    }

    if (!article) {
        return (
            <div className="text-center space-y-4 py-12">
                <AlertCircle
                    className="h-16 w-16 text-black/40 mx-auto"
                    strokeWidth={1.5}
                />
                <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                    Article non trouvé
                </h1>
                <p className="text-[14px] text-black/60">
                    L&apos;article que vous recherchez n&apos;existe pas ou a
                    été supprimé.
                </p>
                <Button
                    onClick={() => router.push("/dashboard/articles")}
                    className="bg-black hover:bg-black/90 text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au catalogue
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ArticleDetailHeader
                nom={article.nom}
                reference={article.reference}
                categorie={article.categorie}
                type={article.type}
                statut={article.statut}
                onBack={() => router.push("/dashboard/articles")}
            />

            {!isService && isLowStock && article.statut !== "RUPTURE" && (
                <ArticleLowStockAlert
                    stock={article.stock}
                    seuilAlerte={article.seuilAlerte}
                />
            )}

            {stats && (
                <ArticleDetailKPIs
                    stats={stats}
                    stock={article.stock}
                    seuilAlerte={article.seuilAlerte}
                    isService={isService}
                />
            )}

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

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                            <CardSection
                                title="Image"
                                className="border-black/8 shadow-sm"
                                titleClassName="text-[16px]"
                            >
                                    <div className="aspect-square relative rounded-lg overflow-hidden bg-black/5">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.nom}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package
                                                    className="h-24 w-24 text-black/20"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 border-black/10 hover:bg-black/5"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Changer l&apos;image
                                    </Button>
                            </CardSection>

                            <CardSection
                                title="Informations"
                                className="border-black/8 shadow-sm"
                                titleClassName="text-[16px]"
                                contentClassName="space-y-3"
                            >
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-black/60">
                                            Référence
                                        </span>
                                        <span className="font-mono font-semibold text-black">
                                            {article.reference}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-black/60">
                                            Catégorie
                                        </span>
                                        <span className="font-medium text-black">
                                            {article.categorie}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-black/60">
                                            Unité
                                        </span>
                                        <span className="font-medium text-black">
                                            unité
                                        </span>
                                    </div>
                            </CardSection>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <CardSection
                                title="Description"
                                className="border-black/8 shadow-sm"
                                titleClassName="text-[16px]"
                            >
                                <p className="text-[14px] text-black/60 whitespace-pre-wrap">
                                    {article.description ||
                                        "Aucune description disponible"}
                                </p>
                            </CardSection>

                            <CardSection
                                title="Tarification"
                                description="Prix de vente et calculs automatiques"
                                className="border-black/8 shadow-sm"
                                titleClassName="text-[16px]"
                                contentClassName="space-y-4"
                            >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[14px] text-black/60">
                                                Prix HT
                                            </p>
                                            <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                                                {article.prix.toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[14px] text-black/60">
                                                TVA
                                            </p>
                                            <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                                                {article.tva}%
                                            </p>
                                            <p className="text-[13px] text-black/40">
                                                +
                                                {(
                                                    prixTTC - article.prix
                                                ).toFixed(2)}{" "}
                                                €
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[14px] text-black/60">
                                                Prix TTC
                                            </p>
                                            <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                                                {prixTTC.toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="bg-black/10" />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-black/60">
                                                Prix unitaire HT
                                            </span>
                                            <span className="font-semibold text-black">
                                                {article.prix.toFixed(2)} €
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className="text-black/60">
                                                Montant TVA
                                            </span>
                                            <span className="font-semibold text-black">
                                                {(
                                                    prixTTC - article.prix
                                                ).toFixed(2)}{" "}
                                                €
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[14px] font-semibold pt-2 border-t border-black/10">
                                            <span className="text-black">
                                                Prix de vente TTC
                                            </span>
                                            <span className="text-black">
                                                {prixTTC.toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                            </CardSection>

                            {!isService && (
                                <CardSection
                                    title="Gestion du stock"
                                    description="Suivi et alertes de disponibilité"
                                    className="border-black/8 shadow-sm"
                                    titleClassName="text-[16px]"
                                    contentClassName="space-y-4"
                                >
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[14px] text-black/60 mb-2">
                                                    Stock actuel
                                                </p>
                                                <p className="text-[40px] font-bold tracking-[-0.02em] text-black">
                                                    {article.stock}
                                                </p>
                                                <p className="text-[13px] text-black/60 mt-1">
                                                    unités disponibles
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[14px] text-black/60 mb-2">
                                                    Seuil d&apos;alerte
                                                </p>
                                                <p className="text-[40px] font-bold tracking-[-0.02em] text-black/60">
                                                    {article.seuilAlerte}
                                                </p>
                                                <p className="text-[13px] text-black/60 mt-1">
                                                    unités minimum
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[14px]">
                                                <span className="text-black/60">
                                                    Niveau
                                                </span>
                                                <Progress
                                                    value={stockPercentage}
                                                    className="w-1/2 h-2"
                                                />
                                            </div>
                                        </div>

                                        <Separator className="bg-black/10" />

                                        <div className="space-y-2 text-[14px]">
                                            <div className="flex justify-between">
                                                <span className="text-black/60">
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
                                                <span className="text-black/60">
                                                    Gestion stock
                                                </span>
                                                <span className="font-semibold text-black">
                                                    Activée
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full border-black/10 hover:bg-black/5"
                                            variant="outline"
                                        >
                                            <Package className="h-4 w-4 mr-2" />
                                            Ajuster le stock
                                        </Button>
                                </CardSection>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="stock" className="space-y-4">
                    <CardSection
                        title="Mouvements de stock"
                        description="Historique complet des entrées et sorties"
                        className="border-black/8 shadow-sm"
                        titleClassName="text-[16px]"
                        action={
                            <Button className="bg-black hover:bg-black/90 text-white">
                                <Package className="h-4 w-4 mr-2" />
                                Nouveau mouvement
                            </Button>
                        }
                    >
                            {mouvements.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package
                                        className="h-12 w-12 text-black/20 mx-auto mb-4"
                                        strokeWidth={1.5}
                                    />
                                    <p className="text-[14px] text-black/60">
                                        Aucun mouvement de stock enregistré
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {mouvements.map((mouvement) => (
                                        <div
                                            key={mouvement.id}
                                            className="flex items-center justify-between p-3 border border-black/8 rounded-lg hover:bg-black/5 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MouvementStockIcon
                                                    type={mouvement.type}
                                                />
                                                <div>
                                                    <p className="font-medium text-[14px] text-black">
                                                        {getMouvementLabel(
                                                            mouvement.type
                                                        )}
                                                    </p>
                                                    <p className="text-[13px] text-black/60">
                                                        {mouvement.motif ||
                                                            "Aucun motif"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-[14px] text-black">
                                                    {mouvement.quantite > 0
                                                        ? "+"
                                                        : ""}
                                                    {mouvement.quantite}
                                                </p>
                                                <p className="text-[13px] text-black/60">
                                                    Stock:{" "}
                                                    {mouvement.stock_apres}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </CardSection>
                </TabsContent>

                <TabsContent value="sales" className="space-y-4">
                    <CardSection
                        title="Analyse des ventes"
                        description="Performance et statistiques de vente"
                        className="border-black/8 shadow-sm"
                        titleClassName="text-[16px]"
                    >
                            <div className="text-center py-12">
                                <BarChart3
                                    className="h-12 w-12 text-black/20 mx-auto mb-4"
                                    strokeWidth={1.5}
                                />
                                <p className="text-[14px] text-black/60">
                                    Les statistiques de vente seront bientôt
                                    disponibles
                                </p>
                            </div>
                    </CardSection>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <CardSection
                        title="Documents liés"
                        description="Devis et factures utilisant cet article"
                        className="border-black/8 shadow-sm"
                        titleClassName="text-[16px]"
                    >
                            {documents.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText
                                        className="h-12 w-12 text-black/20 mx-auto mb-4"
                                        strokeWidth={1.5}
                                    />
                                    <p className="text-[14px] text-black/60">
                                        Aucun document lié à cet article
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-3 border border-black/8 rounded-lg hover:bg-black/5 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText
                                                    className="h-4 w-4 text-black/60"
                                                    strokeWidth={2}
                                                />
                                                <div>
                                                    <p className="font-medium text-[14px] text-black">
                                                        {doc.type} {doc.numero}
                                                    </p>
                                                    <p className="text-[13px] text-black/60">
                                                        {doc.client}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-[14px] text-black">
                                                    {doc.montant.toFixed(2)} €
                                                </p>
                                                <p className="text-[13px] text-black/60">
                                                    x{doc.quantite}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </CardSection>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <CardSection
                        title="Timeline d'activité"
                        description="Historique complet des modifications"
                        className="border-black/8 shadow-sm"
                        titleClassName="text-[16px]"
                    >
                            <div className="text-center py-12">
                                <Clock
                                    className="h-12 w-12 text-black/20 mx-auto mb-4"
                                    strokeWidth={1.5}
                                />
                                <p className="text-[14px] text-black/60">
                                    L&apos;historique des modifications sera
                                    bientôt disponible
                                </p>
                            </div>
                    </CardSection>
                </TabsContent>
            </Tabs>
        </div>
    );
}
