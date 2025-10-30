export type TypeChampCustom =
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "DECIMAL"
    | "SELECT"
    | "MULTISELECT"
    | "CHECKBOX"
    | "DATE"
    | "COLOR"
    | "URL"
    | "EMAIL";

export interface ValidationRules {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    required?: boolean;
}

export interface ChampPersonnalise {
    id: string;
    categorieId: string;
    nom: string;
    code: string;
    type: TypeChampCustom;
    ordre: number;
    obligatoire: boolean;
    placeholder?: string | null;
    description?: string | null;
    options?: string[] | null;
    validation?: ValidationRules | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChampPersonnaliseCreateInput {
    nom: string;
    code: string;
    type: TypeChampCustom;
    ordre?: number;
    obligatoire?: boolean;
    placeholder?: string;
    description?: string;
    options?: string[];
    validation?: ValidationRules;
}

export interface ChampPersonnaliseUpdateInput
    extends Partial<ChampPersonnaliseCreateInput> {}

export type ChampsCustomValues = Record<string, unknown>;

export interface TypeChampInfo {
    label: string;
    description: string;
    icon: string;
    hasOptions: boolean;
    defaultValidation?: ValidationRules;
}

export const TYPE_CHAMP_INFO: Record<TypeChampCustom, TypeChampInfo> = {
    TEXT: {
        label: "Texte court",
        description: "Texte sur une seule ligne",
        icon: "Type",
        hasOptions: false,
        defaultValidation: { maxLength: 255 },
    },
    TEXTAREA: {
        label: "Texte long",
        description: "Texte multiligne",
        icon: "AlignLeft",
        hasOptions: false,
        defaultValidation: { maxLength: 5000 },
    },
    NUMBER: {
        label: "Nombre entier",
        description: "Nombre sans décimales",
        icon: "Hash",
        hasOptions: false,
    },
    DECIMAL: {
        label: "Nombre décimal",
        description: "Nombre avec décimales",
        icon: "Hash",
        hasOptions: false,
    },
    SELECT: {
        label: "Liste déroulante",
        description: "Sélection d'une seule option",
        icon: "List",
        hasOptions: true,
    },
    MULTISELECT: {
        label: "Sélection multiple",
        description: "Sélection de plusieurs options",
        icon: "ListChecks",
        hasOptions: true,
    },
    CHECKBOX: {
        label: "Case à cocher",
        description: "Valeur oui/non",
        icon: "CheckSquare",
        hasOptions: false,
    },
    DATE: {
        label: "Date",
        description: "Sélecteur de date",
        icon: "Calendar",
        hasOptions: false,
    },
    COLOR: {
        label: "Couleur",
        description: "Sélecteur de couleur",
        icon: "Palette",
        hasOptions: false,
    },
    URL: {
        label: "URL",
        description: "Lien web",
        icon: "Link",
        hasOptions: false,
        defaultValidation: {
            pattern:
                "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
        },
    },
    EMAIL: {
        label: "Email",
        description: "Adresse email",
        icon: "Mail",
        hasOptions: false,
        defaultValidation: {
            pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
        },
    },
};
