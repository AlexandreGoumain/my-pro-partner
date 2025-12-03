export interface AssembleeGenerale {
    id: string;
    reference: string;
    type: "ORDINAIRE" | "EXTRAORDINAIRE" | "MIXTE";
    dateAG: string;
    heureDebut: string;
    lieu: string;
    copropriete: {
        id: string;
        nom: string;
    };
    statut: "PLANIFIEE" | "CONVOCATIONS_ENVOYEES" | "EN_COURS" | "TERMINEE" | "PV_ENVOYE";
    nbResolutions: number;
    nbResolutionsVotees?: number;
    quorum?: number;
    nbPresents?: number;
    nbRepresentes?: number;
    dateConvocation?: string;
    dateLimitePouvoir?: string;
}

export interface AGFilters {
    copropriete: string;
    type: string;
    statut: string;
    search: string;
}
