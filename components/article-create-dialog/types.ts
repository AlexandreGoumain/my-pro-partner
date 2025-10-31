import { UseFormReturn } from "react-hook-form";
import { ArticleCreateInput } from "@/lib/validation";

export type ArticleType = "PRODUIT" | "SERVICE";
export type Step = 1 | 2 | 3 | 4 | 5;
export type Direction = "left" | "right";

export interface ArticleFormValues extends ArticleCreateInput {
    type: ArticleType;
}

export interface Category {
    id: string;
    nom: string;
    parentId: string | null;
    enfants?: Category[];
}

export interface StepProps {
    form: UseFormReturn<ArticleFormValues>;
    articleType: ArticleType | null;
    onTypeSelect?: (type: ArticleType) => void;
    categories: Category[];
    loadingCategories: boolean;
    onNavigateToCategories?: () => void;
}
