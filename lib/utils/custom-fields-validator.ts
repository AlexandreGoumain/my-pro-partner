/**
 * Utilitaires pour valider et gérer les champs personnalisés
 */

import { ChampPersonnalise, ValidationRules } from "@/lib/types/custom-fields";

export interface ValidationError {
    code: string;
    message: string;
}

/**
 * Valide une valeur selon les règles d'un champ personnalisé
 */
export function validateFieldValue(
    field: ChampPersonnalise,
    value: unknown
): ValidationError | null {
    const { nom, code, type, obligatoire, validation, options } = field;

    // 1. Vérifier si obligatoire
    if (obligatoire && (value === undefined || value === null || value === "")) {
        return {
            code,
            message: `Le champ "${nom}" est obligatoire`,
        };
    }

    // Si pas de valeur et pas obligatoire, c'est OK
    if (value === undefined || value === null || value === "") {
        return null;
    }

    // 2. Validation selon le type
    switch (type) {
        case "TEXT":
        case "TEXTAREA":
        case "URL":
        case "EMAIL":
            if (typeof value !== "string") {
                return {
                    code,
                    message: `Le champ "${nom}" doit être du texte`,
                };
            }
            return validateTextRules(nom, code, value, validation);

        case "NUMBER":
        case "DECIMAL":
            if (typeof value !== "number" && typeof value !== "string") {
                return {
                    code,
                    message: `Le champ "${nom}" doit être un nombre`,
                };
            }
            const numValue =
                typeof value === "string" ? parseFloat(value) : value;
            if (isNaN(numValue)) {
                return {
                    code,
                    message: `Le champ "${nom}" doit être un nombre valide`,
                };
            }
            return validateNumberRules(nom, code, numValue, validation);

        case "SELECT":
            if (typeof value !== "string") {
                return {
                    code,
                    message: `Le champ "${nom}" doit être une option valide`,
                };
            }
            if (options && !options.includes(value)) {
                return {
                    code,
                    message: `La valeur "${value}" n'est pas une option valide pour "${nom}"`,
                };
            }
            break;

        case "MULTISELECT":
            if (!Array.isArray(value)) {
                return {
                    code,
                    message: `Le champ "${nom}" doit être une liste d'options`,
                };
            }
            if (options) {
                const invalidOptions = value.filter(
                    (v) => !options.includes(v as string)
                );
                if (invalidOptions.length > 0) {
                    return {
                        code,
                        message: `Options invalides pour "${nom}": ${invalidOptions.join(", ")}`,
                    };
                }
            }
            break;

        case "CHECKBOX":
            if (typeof value !== "boolean") {
                return {
                    code,
                    message: `Le champ "${nom}" doit être oui ou non`,
                };
            }
            break;

        case "DATE":
            if (typeof value !== "string" || isNaN(Date.parse(value))) {
                return {
                    code,
                    message: `Le champ "${nom}" doit être une date valide`,
                };
            }
            break;

        case "COLOR":
            if (
                typeof value !== "string" ||
                !/^#[0-9A-F]{6}$/i.test(value)
            ) {
                return {
                    code,
                    message: `Le champ "${nom}" doit être une couleur valide (format: #RRGGBB)`,
                };
            }
            break;
    }

    return null;
}

/**
 * Valide les règles pour les champs texte
 */
function validateTextRules(
    nom: string,
    code: string,
    value: string,
    rules?: ValidationRules | null
): ValidationError | null {
    if (!rules) return null;

    if (rules.minLength && value.length < rules.minLength) {
        return {
            code,
            message: `Le champ "${nom}" doit contenir au moins ${rules.minLength} caractères`,
        };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            code,
            message: `Le champ "${nom}" ne peut pas dépasser ${rules.maxLength} caractères`,
        };
    }

    if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
            return {
                code,
                message: `Le format du champ "${nom}" est invalide`,
            };
        }
    }

    return null;
}

/**
 * Valide les règles pour les champs numériques
 */
function validateNumberRules(
    nom: string,
    code: string,
    value: number,
    rules?: ValidationRules | null
): ValidationError | null {
    if (!rules) return null;

    if (rules.min !== undefined && value < rules.min) {
        return {
            code,
            message: `Le champ "${nom}" doit être supérieur ou égal à ${rules.min}`,
        };
    }

    if (rules.max !== undefined && value > rules.max) {
        return {
            code,
            message: `Le champ "${nom}" doit être inférieur ou égal à ${rules.max}`,
        };
    }

    return null;
}

/**
 * Valide tous les champs personnalisés d'un article
 */
export function validateCustomFields(
    fields: ChampPersonnalise[],
    values: Record<string, unknown>
): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field of fields) {
        const value = values[field.code];
        const error = validateFieldValue(field, value);
        if (error) {
            errors.push(error);
        }
    }

    return errors;
}

/**
 * Nettoie les valeurs des champs personnalisés (supprime les champs non définis)
 */
export function sanitizeCustomFieldValues(
    fields: ChampPersonnalise[],
    values: Record<string, unknown>
): Record<string, unknown> {
    const validCodes = new Set(fields.map((f) => f.code));
    const sanitized: Record<string, unknown> = {};

    for (const [code, value] of Object.entries(values)) {
        if (validCodes.has(code) && value !== undefined && value !== null) {
            sanitized[code] = value;
        }
    }

    return sanitized;
}
