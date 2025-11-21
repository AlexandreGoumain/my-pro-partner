import { UseFormReturn } from "react-hook-form";
import { ArticleCreateInput } from "@/lib/validation";

export type ArticleType = "PRODUIT" | "SERVICE" | "OCCASION";
export type Step = 1 | 2 | 3 | 4 | 5 | 6;
export type Direction = "left" | "right";

export interface ArticleFormValues extends ArticleCreateInput {
    type: ArticleType;
    // Occasion-specific fields (optional)
    etat?: "COMME_NEUF" | "TRES_BON" | "BON" | "CORRECT" | "POUR_PIECES";
    provenance?: "RACHAT_CLIENT" | "MARKETPLACE_OCCASION" | "REPRISE" | "DON" | "RETOUR_SAV" | "AUTRE";
    prixRachat?: number;
    numeroSerie?: string;
    notesRachat?: string;
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
