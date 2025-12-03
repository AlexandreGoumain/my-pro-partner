import type { Employee } from "@/hooks/use-employees";
import { z } from "zod";

// Shared schema for employee form
export const employeeFormSchema = z.object({
    // Personal info
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    telephone: z.string().max(20).optional().or(z.literal("")),
    dateNaissance: z.string().optional().or(z.literal("")),
    adresse: z.string().max(200).optional().or(z.literal("")),
    ville: z.string().max(100).optional().or(z.literal("")),
    codePostal: z.string().max(10).optional().or(z.literal("")),
    pays: z.string().max(100).default("France"),
    // Professional info
    poste: z.string().min(1, "Le poste est requis").max(100),
    departement: z.string().max(100).optional().or(z.literal("")),
    statut: z
        .enum(["ACTIF", "CONGE", "MALADIE", "ABSENT", "INACTIF"])
        .default("ACTIF"),
    typeContrat: z
        .enum(["CDI", "CDD", "INTERIM", "APPRENTI", "STAGE", "FREELANCE"])
        .default("CDI"),
    dateEmbauche: z.string().min(1, "La date d'embauche est requise"),
    dateFin: z.string().optional().or(z.literal("")),
    // Compensation
    salaireBrut: z
        .number()
        .min(0, "Le salaire doit être positif")
        .max(999999.99),
    devise: z.string().max(10).default("EUR"),
    heuresHebdo: z.number().int().min(1).max(70).default(35).optional(),
    joursTravail: z.string().max(100).optional().or(z.literal("")),
    // Leave & Notes
    congesRestants: z.number().int().min(0).max(365).default(25).optional(),
    congesPris: z.number().int().min(0).max(365).default(0).optional(),
    notes: z.string().max(2000).optional().or(z.literal("")),
    competences: z.string().max(2000).optional().or(z.literal("")),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export const defaultFormValues: EmployeeFormData = {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    poste: "",
    departement: "",
    statut: "ACTIF",
    typeContrat: "CDI",
    dateEmbauche: new Date().toISOString().split("T")[0],
    dateFin: "",
    salaireBrut: 0,
    devise: "EUR",
    heuresHebdo: 35,
    joursTravail: "",
    congesRestants: 25,
    congesPris: 0,
    notes: "",
    competences: "",
};

/**
 * Convert Employee to form data for editing
 */
export function employeeToFormData(employee: Employee): EmployeeFormData {
    return {
        prenom: employee.prenom,
        nom: employee.nom,
        email: employee.email,
        telephone: employee.telephone || "",
        dateNaissance: employee.dateNaissance
            ? new Date(employee.dateNaissance).toISOString().split("T")[0]
            : "",
        adresse: employee.adresse || "",
        ville: employee.ville || "",
        codePostal: employee.codePostal || "",
        pays: employee.pays || "France",
        poste: employee.poste,
        departement: employee.departement || "",
        statut: employee.statut,
        typeContrat: employee.typeContrat,
        dateEmbauche: new Date(employee.dateEmbauche)
            .toISOString()
            .split("T")[0],
        dateFin: employee.dateFin
            ? new Date(employee.dateFin).toISOString().split("T")[0]
            : "",
        salaireBrut: Number(employee.salaireBrut),
        devise: employee.devise || "EUR",
        heuresHebdo: employee.heuresHebdo || 35,
        joursTravail: employee.joursTravail || "",
        notes: employee.notes || "",
        competences: employee.competences || "",
        congesRestants: employee.congesRestants || 25,
        congesPris: employee.congesPris || 0,
    };
}
