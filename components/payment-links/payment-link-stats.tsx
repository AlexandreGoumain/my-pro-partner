import { StatCard } from "@/components/ui/stat-card";
import { Link2, Eye, TrendingUp, BarChart3 } from "lucide-react";

export interface PaymentLinkStatsProps {
    totalLinks: number;
    totalViews: number;
    totalPayments: number;
    totalRevenue: string;
}

export function PaymentLinkStats({
    totalLinks,
    totalViews,
    totalPayments,
    totalRevenue,
}: PaymentLinkStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatCard
                icon={Link2}
                label="Total liens"
                value={totalLinks}
                size="sm"
            />
            <StatCard
                icon={Eye}
                label="Vues totales"
                value={totalViews}
                size="sm"
            />
            <StatCard
                icon={TrendingUp}
                label="Paiements"
                value={totalPayments}
                size="sm"
            />
            <StatCard
                icon={BarChart3}
                label="CA total"
                value={`${totalRevenue}€`}
                size="sm"
            />
        </div>
    );
}
