import { DashboardStats } from "@/lib/types/dashboard";
import { Award, FileText, Star, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";

export interface StatsGridProps {
    stats: DashboardStats | null;
}

/**
 * Grid of statistics cards for the dashboard
 * Displays points, loyalty level, documents count, and expiring points
 *
 * Note: Ce composant utilise le StatCard local car il a un style différent
 * (icône à gauche au lieu d'en haut) spécifique au portail client
 */
export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-5 md:grid-cols-4">
            <StatCard
                icon={Star}
                label="Mes points"
                value={stats?.client.points_solde || 0}
            />

            {stats?.client.niveauFidelite ? (
                <StatCard
                    icon={Award}
                    label="Mon niveau"
                    value={stats.client.niveauFidelite.nom}
                    iconBgStyle={`${stats.client.niveauFidelite.couleur}15`}
                    iconColorStyle={stats.client.niveauFidelite.couleur}
                />
            ) : (
                <StatCard icon={Award} label="Mon niveau" value="Aucun" />
            )}

            <StatCard
                icon={FileText}
                label="Documents"
                value={stats?.documentsCount || 0}
            />

            <StatCard
                icon={TrendingUp}
                label="Expirent bientôt"
                value={stats?.pointsExpiringSoon || 0}
            />
        </div>
    );
}
