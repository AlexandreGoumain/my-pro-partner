export interface ClientProfile {
    nom: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    pays: string;
}

export interface ClientProfileUpdate {
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
}
