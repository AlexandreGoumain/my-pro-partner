/**
 * Authentication validation schemas
 */

import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
});

export const clientLoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email invalide"),
});

export const registerSchema = z
    .object({
        email: z.string().email("Email invalide"),
        password: z.string().min(6, "Mot de passe trop court"),
        confirmPassword: z.string(),
        name: z.string().min(2, "Nom requis"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export const registerBackendSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
    name: z.string().min(2, "Nom requis"),
});

export const clientRegisterSchema = z
    .object({
        nom: z
            .string()
            .min(1, "Le nom est requis")
            .max(100, "Le nom ne peut pas dépasser 100 caractères"),
        prenom: z
            .string()
            .max(100, "Le prénom ne peut pas dépasser 100 caractères")
            .optional(),
        email: z.string().email("Email invalide"),
        telephone: z
            .string()
            .min(1, "Le téléphone est requis")
            .max(20, "Le téléphone ne peut pas dépasser 20 caractères"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
        adresse: z
            .string()
            .max(200, "L'adresse ne peut pas dépasser 200 caractères")
            .optional(),
        codePostal: z
            .string()
            .max(10, "Le code postal ne peut pas dépasser 10 caractères")
            .optional(),
        ville: z
            .string()
            .max(100, "La ville ne peut pas dépasser 100 caractères")
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export const acceptInvitationSchema = z
    .object({
        name: z.string().optional(),
        prenom: z.string().optional(),
        telephone: z.string().optional(),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type ClientLoginInput = z.infer<typeof clientLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterBackendInput = z.infer<typeof registerBackendSchema>;
export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
