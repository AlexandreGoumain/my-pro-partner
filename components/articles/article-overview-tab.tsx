import { ArticleDescriptionSection } from "@/components/articles/article-description-section";
import { ArticleImageSection } from "@/components/articles/article-image-section";
import { ArticleInfoSection } from "@/components/articles/article-info-section";
import { ArticlePricingSection } from "@/components/articles/article-pricing-section";
import { ArticleStockSection } from "@/components/articles/article-stock-section";

export interface ArticleOverviewTabProps {
    article: {
        nom: string;
        reference: string;
        categorie: string;
        image?: string;
        description?: string;
        prix: number;
        tva: number;
        stock: number;
        seuilAlerte: number;
    };
    isService: boolean;
    onChangeImage?: () => void;
    onAdjustStock?: () => void;
    className?: string;
}

export function ArticleOverviewTab({
    article,
    isService,
    onChangeImage,
    onAdjustStock,
    className = "",
}: ArticleOverviewTabProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <ArticleImageSection
                        image={article.image}
                        nom={article.nom}
                        onChangeImage={onChangeImage}
                    />

                    <ArticleInfoSection
                        reference={article.reference}
                        categorie={article.categorie}
                    />
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <ArticleDescriptionSection description={article.description} />

                    <ArticlePricingSection
                        prixHT={article.prix}
                        tva={article.tva}
                    />

                    {!isService && (
                        <ArticleStockSection
                            stock={article.stock}
                            seuilAlerte={article.seuilAlerte}
                            onAdjustStock={onAdjustStock}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
