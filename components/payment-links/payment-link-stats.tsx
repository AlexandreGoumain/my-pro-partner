import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { BarChart3, Eye, Link2, TrendingUp } from "lucide-react";

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
    const stats: StatConfig[] = [
        {
            id: "links",
            icon: Link2,
            label: "Total liens",
            value: totalLinks,
            size: "sm",
        },
        {
            id: "views",
            icon: Eye,
            label: "Vues totales",
            value: totalViews,
            size: "sm",
        },
        {
            id: "payments",
            icon: TrendingUp,
            label: "Paiements",
            value: totalPayments,
            size: "sm",
        },
        {
            id: "revenue",
            icon: BarChart3,
            label: "CA total",
            value: `${totalRevenue}€`,
            size: "sm",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 4 }} gap={4} />;
}
