export const TYPE_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "ORDINAIRE", label: "AG Ordinaire" },
    { value: "EXTRAORDINAIRE", label: "AG Extraordinaire" },
    { value: "MIXTE", label: "AG Mixte" },
];

export const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "PLANIFIEE", label: "Planifiée" },
    { value: "CONVOCATIONS_ENVOYEES", label: "Convocations envoyées" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINEE", label: "Terminée" },
    { value: "PV_ENVOYE", label: "PV envoyé" },
];

export const TYPE_LABELS: Record<string, string> = {
    ORDINAIRE: "AG Ordinaire",
    EXTRAORDINAIRE: "AG Extraordinaire",
    MIXTE: "AG Mixte",
};

export const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    PLANIFIEE: { label: "Planifiée", variant: "outline" },
    CONVOCATIONS_ENVOYEES: { label: "Convoquée", variant: "secondary" },
    EN_COURS: { label: "En cours", variant: "default" },
    TERMINEE: { label: "Terminée", variant: "secondary" },
    PV_ENVOYE: { label: "PV envoyé", variant: "default" },
};
