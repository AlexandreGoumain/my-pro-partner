import { Card } from "@/components/ui/card";
import { POSArticle } from "@/lib/types/pos";

export interface POSArticleCardProps {
    article: POSArticle;
    onClick: (article: POSArticle) => void;
}

export function POSArticleCard({ article, onClick }: POSArticleCardProps) {
    return (
        <Card
            className="p-4 border-black/8 hover:border-black/20 cursor-pointer transition-all"
            onClick={() => onClick(article)}
        >
            <div className="text-[15px] font-semibold text-black mb-1 truncate">
                {article.nom}
            </div>
            <div className="text-[13px] text-black/60 mb-2 truncate">
                {article.reference}
            </div>
            <div className="text-[18px] font-semibold text-black">
                {Number(article.prix_ht).toFixed(2)}€
            </div>
            <div className="text-[12px] text-black/40">
                HT • TVA {article.tva_taux}%
            </div>
        </Card>
    );
}
