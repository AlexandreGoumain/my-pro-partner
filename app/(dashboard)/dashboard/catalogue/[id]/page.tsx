"use client";

import { ArticleDetailHeader } from "@/components/articles/article-detail-header";
import { ArticleDetailKPIs } from "@/components/articles/article-detail-kpis";
import { ArticleDocumentsTab } from "@/components/articles/article-documents-tab";
import { ArticleHistoryTab } from "@/components/articles/article-history-tab";
import { ArticleLowStockAlert } from "@/components/articles/article-low-stock-alert";
import { ArticleOverviewTab } from "@/components/articles/article-overview-tab";
import { ArticleSalesTab } from "@/components/articles/article-sales-tab";
import { ArticleStockTab } from "@/components/articles/article-stock-tab";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { RouteGuard } from "@/components/ui/route-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticleDetail } from "@/hooks/use-article-detail";
import { AlertCircle, ArrowLeft } from "lucide-react";
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

    const isLowStock = useMemo(
        () => (article ? article.stock <= article.seuilAlerte : false),
        [article]
    );

    const isService = useMemo(() => article?.type === "SERVICE", [article]);

    return (
        <RouteGuard capability="atelier">
            <ConditionalSkeleton
                isLoading={isLoading}
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 4,
                    gridColumns: 2,
                    itemCount: 4,
                    withTabs: true,
                    tabsCount: 5,
                    statsHeight: "h-32",
                    itemHeight: "h-80",
                }}
            >
                {!article ? (
                <EmptyState
                    icon={AlertCircle}
                    title="Article non trouvé"
                    description="L'article que vous recherchez n'existe pas ou a été supprimé."
                    action={{
                        label: "Retour au catalogue",
                        onClick: () => router.push("/dashboard/catalogue"),
                        icon: ArrowLeft,
                    }}
                />
            ) : (
                <div className="space-y-6">
                    <ArticleDetailHeader
                        nom={article.nom}
                        reference={article.reference}
                        categorie={article.categorie}
                        type={article.type}
                        statut={article.statut}
                        onBack={() => router.push("/dashboard/catalogue")}
                    />

                    {!isService &&
                        isLowStock &&
                        article.statut !== "RUPTURE" && (
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
                            <TabsTrigger value="documents">
                                Documents
                            </TabsTrigger>
                            <TabsTrigger value="history">
                                Historique
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <ArticleOverviewTab
                                article={article}
                                isService={isService}
                            />
                        </TabsContent>

                        <TabsContent value="stock" className="space-y-4">
                            <ArticleStockTab mouvements={mouvements} />
                        </TabsContent>

                        <TabsContent value="sales" className="space-y-4">
                            <ArticleSalesTab />
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                            <ArticleDocumentsTab documents={documents} />
                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">
                            <ArticleHistoryTab />
                        </TabsContent>
                    </Tabs>
                </div>
            )}
            </ConditionalSkeleton>
        </RouteGuard>
    );
}
