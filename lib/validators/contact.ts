import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de contact
 * Utilisé côté frontend (react-hook-form) et miroir du backend
 */
export const contactSchema = z.object({
    name: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Nom trop long"),
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
    message: z
        .string()
        .min(10, "Le message doit contenir au moins 10 caractères")
        .max(5000, "Message trop long"),
    website: z.string().optional(), // Honeypot
});

export type ContactFormValues = z.infer<typeof contactSchema>;
