import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Type pour le résultat de la validation
 */
export type ValidationResult<T> =
    | { success: true; data: T }
    | { success: false; response: NextResponse };

/**
 * Valide des données avec un schéma Zod et retourne soit les données validées,
 * soit une NextResponse d'erreur standardisée
 *
 * @param schema - Le schéma Zod à utiliser pour la validation
 * @param data - Les données à valider
 * @returns Un objet contenant soit les données validées, soit une NextResponse d'erreur
 *
 * @example
 * ```typescript
 * const result = validateRequest(clientCreateSchema, body);
 * if (!result.success) return result.response;
 *
 * // TypeScript sait que result.data est valide ici
 * const client = await prisma.client.create({
 *   data: result.data
 * });
 * ```
 */
export function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): ValidationResult<T> {
    const validation = schema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            response: NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            ),
        };
    }

    return {
        success: true,
        data: validation.data,
    };
}

/**
 * Valide des données avec un schéma Zod et retourne soit null si valide,
 * soit une NextResponse d'erreur. Utile pour un pattern early-return simple.
 *
 * @param schema - Le schéma Zod à utiliser pour la validation
 * @param data - Les données à valider
 * @returns null si la validation réussit, sinon une NextResponse d'erreur
 *
 * @example
 * ```typescript
 * const body = await req.json();
 * const error = validateOrError(clientCreateSchema, body);
 * if (error) return error;
 *
 * // body est maintenant typé selon le schéma
 * const client = await prisma.client.create({
 *   data: body
 * });
 * ```
 */
export function validateOrError<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): NextResponse | null {
    const validation = schema.safeParse(data);

    if (!validation.success) {
        return NextResponse.json(
            {
                message: "Données invalides",
                errors: validation.error.errors,
            },
            { status: 400 }
        );
    }

    return null;
}

/**
 * Valide des données avec un schéma Zod et lance une erreur si invalide.
 * Les données validées sont retournées avec le bon type.
 *
 * @param schema - Le schéma Zod à utiliser pour la validation
 * @param data - Les données à valider
 * @returns Les données validées avec le bon type
 * @throws {ValidationError} Si la validation échoue
 *
 * @example
 * ```typescript
 * try {
 *   const body = await req.json();
 *   const validData = parseOrThrow(clientCreateSchema, body);
 *
 *   const client = await prisma.client.create({
 *     data: validData
 *   });
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     return NextResponse.json(
 *       { message: error.message, errors: error.errors },
 *       { status: 400 }
 *     );
 *   }
 *   throw error;
 * }
 * ```
 */
export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const validation = schema.safeParse(data);

    if (!validation.success) {
        throw new ValidationError(validation.error.errors);
    }

    return validation.data;
}

/**
 * Erreur personnalisée pour les erreurs de validation Zod
 */
export class ValidationError extends Error {
    constructor(public errors: z.ZodError["errors"]) {
        super("Données invalides");
        this.name = "ValidationError";
    }
}
