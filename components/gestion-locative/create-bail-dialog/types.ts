import { z } from "zod";

export const TYPE_BAIL_OPTIONS = [
    { value: "HABITATION_VIDE", label: "Habitation vide" },
    { value: "HABITATION_MEUBLEE", label: "Habitation meublée" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "PROFESSIONNEL", label: "Professionnel" },
    { value: "MIXTE", label: "Mixte" },
    { value: "SAISONNIER", label: "Saisonnier" },
];

export const DUREE_OPTIONS = [
    { value: "12", label: "12 mois (meublé)" },
    { value: "36", label: "36 mois (vide)" },
    { value: "6", label: "6 mois (saisonnier)" },
    { value: "9", label: "9 mois (étudiant)" },
    { value: "72", label: "72 mois (commercial)" },
];

export const bailCreateSchema = z.object({
    bienId: z.string().min(1, "Le bien est requis"),
    locataireId: z.string().min(1, "Le locataire est requis"),
    proprietaireId: z.string().min(1, "Le propriétaire est requis"),
    typeBail: z.string().min(1, "Le type de bail est requis"),
    dateDebut: z.date({ required_error: "La date de début est requise" }),
    dureeMois: z.number().min(1, "La durée est requise"),
    loyerHC: z.number().min(0, "Le loyer doit être positif"),
    provisions: z.number().min(0),
    depotGarantie: z.number().min(0),
});

export type BailFormValues = z.infer<typeof bailCreateSchema>;

export const defaultValues: BailFormValues = {
    bienId: "",
    locataireId: "",
    proprietaireId: "",
    typeBail: "HABITATION_VIDE",
    dateDebut: new Date(),
    dureeMois: 36,
    loyerHC: 0,
    provisions: 0,
    depotGarantie: 0,
};

export interface CreateBailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}
