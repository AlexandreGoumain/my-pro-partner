/**
 * Validation patterns - Security-focused regex patterns for input validation
 */

import { z } from "zod";

// Phone number patterns
// Flexible pattern for international formats (allows +, digits, spaces, dashes, parentheses)
export const PHONE_REGEX = /^[+]?[\d\s\-().]{9,20}$/;

// Stricter French phone number pattern
export const PHONE_FR_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// Postal code patterns
export const POSTAL_CODE_FR_REGEX = /^\d{5}$/;
export const POSTAL_CODE_FLEXIBLE_REGEX = /^[\dA-Za-z\s-]{3,10}$/;

// SIRET/SIREN patterns (France)
export const SIRET_REGEX = /^\d{14}$/;
export const SIREN_REGEX = /^\d{9}$/;

// UUID pattern
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// CUID pattern (used by Prisma)
export const CUID_REGEX = /^c[a-z0-9]{24}$/;

// Flexible ID pattern (UUID or CUID)
export const ID_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|c[a-z0-9]{24})$/i;

/**
 * Zod schemas with validation patterns
 */

// Phone number schema - flexible international format
export const phoneSchema = z
    .string()
    .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
    .regex(PHONE_REGEX, "Format de téléphone invalide")
    .optional()
    .or(z.literal(""));

// Phone number schema - strict French format
export const phoneFrSchema = z
    .string()
    .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
    .regex(PHONE_FR_REGEX, "Format de téléphone français invalide (ex: 06 12 34 56 78)")
    .optional()
    .or(z.literal(""));

// Postal code schema - French 5 digits
export const postalCodeFrSchema = z
    .string()
    .regex(POSTAL_CODE_FR_REGEX, "Le code postal doit contenir 5 chiffres")
    .optional()
    .or(z.literal(""));

// Postal code schema - flexible format
export const postalCodeSchema = z
    .string()
    .max(10, "Le code postal ne peut pas dépasser 10 caractères")
    .regex(POSTAL_CODE_FLEXIBLE_REGEX, "Format de code postal invalide")
    .optional()
    .or(z.literal(""));

// ID schema (validates UUID or CUID format)
export const idSchema = z
    .string()
    .min(1, "L'identifiant est requis")
    .regex(ID_REGEX, "Format d'identifiant invalide");

// Optional ID schema
export const optionalIdSchema = z
    .string()
    .regex(ID_REGEX, "Format d'identifiant invalide")
    .optional()
    .nullable()
    .or(z.literal(""));

// SIRET schema
export const siretSchema = z
    .string()
    .regex(SIRET_REGEX, "Le SIRET doit contenir 14 chiffres")
    .optional()
    .or(z.literal(""));

// SIREN schema
export const sirenSchema = z
    .string()
    .regex(SIREN_REGEX, "Le SIREN doit contenir 9 chiffres")
    .optional()
    .or(z.literal(""));
