import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";
import type { MouvementPoints } from "@/hooks/use-loyalty-points";

export interface ClientLoyaltyClient {
    points_solde: number;
    niveauFidelite?: NiveauFidelite;
}

export interface ClientLoyaltyNextLevel {
    nextLevel: NiveauFidelite;
    pointsNeeded: number;
    currentPoints: number;
    progress: number;
}

export interface ClientLoyaltyData {
    client: ClientLoyaltyClient;
    pointsExpiringSoon: number;
    nextLevel: ClientLoyaltyNextLevel | null;
    mouvements: MouvementPoints[];
}
