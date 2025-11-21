import { CardSection } from "@/components/ui/card-section";

export interface ArticleInfoSectionProps {
    reference: string;
    categorie: string;
    unite?: string;
    className?: string;
}

export function ArticleInfoSection({
    reference,
    categorie,
    unite = "unité",
    className = "",
}: ArticleInfoSectionProps) {
    return (
        <CardSection
            title="Informations"
            className={`border-black/8 shadow-sm ${className}`}
            titleClassName="text-[16px]"
            contentClassName="space-y-3"
        >
            <div className="flex justify-between text-[14px]">
                <span className="text-black/60">Référence</span>
                <span className="font-mono font-semibold text-black">
                    {reference}
                </span>
            </div>
            <div className="flex justify-between text-[14px]">
                <span className="text-black/60">Catégorie</span>
                <span className="font-medium text-black">{categorie}</span>
            </div>
            <div className="flex justify-between text-[14px]">
                <span className="text-black/60">Unité</span>
                <span className="font-medium text-black">{unite}</span>
            </div>
        </CardSection>
    );
}
