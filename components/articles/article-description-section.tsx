import { CardSection } from "@/components/ui/card-section";

export interface ArticleDescriptionSectionProps {
    description?: string;
    className?: string;
}

export function ArticleDescriptionSection({
    description,
    className = "",
}: ArticleDescriptionSectionProps) {
    return (
        <CardSection
            title="Description"
            className={`border-black/8 shadow-sm ${className}`}
            titleClassName="text-[16px]"
        >
            <p className="text-[14px] text-black/60 whitespace-pre-wrap">
                {description || "Aucune description disponible"}
            </p>
        </CardSection>
    );
}
