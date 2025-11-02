import type { CSVMapping } from "@/components/csv-import-dialog";

export const CLIENT_CSV_MAPPINGS: CSVMapping[] = [
    {
        csvHeader: "Nom",
        targetField: "nom",
        label: "Nom",
        required: true,
    },
    {
        csvHeader: "Prénom",
        targetField: "prenom",
        label: "Prénom",
    },
    {
        csvHeader: "Email",
        targetField: "email",
        label: "Email",
        validator: (value) => {
            if (!value || value.trim() === "") return { valid: true };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value)
                ? { valid: true }
                : { valid: false, error: "Email invalide" };
        },
    },
    {
        csvHeader: "Téléphone",
        targetField: "telephone",
        label: "Téléphone",
    },
    {
        csvHeader: "Adresse",
        targetField: "adresse",
        label: "Adresse",
    },
    {
        csvHeader: "Ville",
        targetField: "ville",
        label: "Ville",
    },
    {
        csvHeader: "Code Postal",
        targetField: "codePostal",
        label: "Code Postal",
    },
    {
        csvHeader: "Pays",
        targetField: "pays",
        label: "Pays",
    },
    {
        csvHeader: "Notes",
        targetField: "notes",
        label: "Notes",
    },
];
