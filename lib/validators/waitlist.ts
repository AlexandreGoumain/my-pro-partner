import { z } from "zod";

/**
 * Schéma de validation pour le formulaire waitlist
 * Utilisé côté frontend (react-hook-form) et miroir du backend
 */
export const waitlistSchema = z.object({
    email: z
        .string()
        .min(1, "L'email est requis")
        .email("Email invalide")
        .max(255, "Email trop long"),
    company: z
        .string()
        .max(100, "Nom d'entreprise trop long")
        .optional(),
    phone: z
        .string()
        .max(20, "Numéro trop long")
        .regex(/^[\d\s]*$/, "Uniquement des chiffres")
        .optional()
        .or(z.literal("")),
    templateType: z.string().optional(),
    website: z.string().optional(), // Honeypot
});

export type WaitlistFormValues = z.infer<typeof waitlistSchema>;

/**
 * Types d'activités disponibles pour la waitlist
 */
export const ACTIVITY_TYPES = [
    { value: "PLOMBERIE", label: "Plombier" },
    { value: "ELECTRICITE", label: "Électricien" },
    { value: "CHAUFFAGE", label: "Chauffagiste" },
    { value: "MENUISERIE", label: "Menuisier" },
    { value: "PEINTURE", label: "Peintre" },
    { value: "MACONNERIE", label: "Maçon" },
    { value: "RESTAURATION", label: "Restaurant / Café / Bar" },
    { value: "BOULANGERIE", label: "Boulangerie / Pâtisserie" },
    { value: "COIFFURE", label: "Salon de coiffure" },
    { value: "ESTHETIQUE", label: "Institut de beauté / Spa" },
    { value: "FITNESS", label: "Salle de sport / Coaching" },
    { value: "GARAGE", label: "Garage automobile" },
    { value: "INFORMATIQUE", label: "Services informatiques" },
    { value: "CONSULTING", label: "Conseil / Formation" },
    { value: "COMMERCE_DETAIL", label: "Commerce de détail" },
    { value: "IMMOBILIER", label: "Agence immobilière" },
    { value: "SANTE", label: "Professions médicales/paramédicales" },
    { value: "JURIDIQUE", label: "Avocat / Notaire" },
    { value: "COMPTABILITE", label: "Expert-comptable" },
    { value: "GENERAL", label: "Autre" },
] as const;
