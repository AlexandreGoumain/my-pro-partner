"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ActivityEvent } from "@/lib/types/dashboard";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Clock,
    CreditCard,
    FileText,
    Megaphone,
    Package,
    User,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface ActivityTimelineCardProps {
    activities: ActivityEvent[];
    className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getRelativeTime(date: Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

function formatCurrency(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k€`;
    }
    return `${value.toFixed(0)}€`;
}

// ============================================================================
// Component
// ============================================================================

export function ActivityTimelineCard({
    activities,
    className,
}: ActivityTimelineCardProps) {
    // Icon mapping
    const typeIcons = {
        client: User,
        document: FileText,
        payment: CreditCard,
        stock: Package,
        campaign: Megaphone,
    };

    // Color mapping
    const typeColors = {
        client: {
            icon: "text-black/70",
            bg: "bg-black/5",
            dot: "bg-black/70",
        },
        document: {
            icon: "text-black/80",
            bg: "bg-black/5",
            dot: "bg-black/80",
        },
        payment: {
            icon: "text-black",
            bg: "bg-black/5",
            dot: "bg-black",
        },
        stock: {
            icon: "text-black/60",
            bg: "bg-black/3",
            dot: "bg-black/60",
        },
        campaign: {
            icon: "text-black/50",
            bg: "bg-black/3",
            dot: "bg-black/50",
        },
    };

    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Activité Récente
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Dernières actions
                    </p>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <EmptyState
                            icon={Clock}
                            title="Aucune activité récente"
                            variant="minimal"
                            iconSize="sm"
                            textSize="sm"
                        />
                    ) : (
                        activities.map((activity, index) => {
                            const Icon = typeIcons[activity.type];
                            const colors = typeColors[activity.type];

                            return (
                                <div
                                    key={activity.id}
                                    className="relative pl-8"
                                >
                                    {/* Timeline line (except for last item) */}
                                    {index < activities.length - 1 && (
                                        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-black/8" />
                                    )}

                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-[6px] top-[6px] w-3 h-3 rounded-full ${colors.dot}`}
                                    />

                                    {/* Content */}
                                    <div className="space-y-1">
                                        {/* Action */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                <div
                                                    className={`flex-shrink-0 p-1.5 rounded-md ${colors.bg} mt-0.5`}
                                                >
                                                    <Icon
                                                        className={`w-3 h-3 ${colors.icon}`}
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-medium text-black leading-snug">
                                                        {activity.action}
                                                    </p>
                                                    <p className="text-[12px] text-black/60 leading-snug mt-0.5">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Time */}
                                            <span className="text-[11px] text-black/40 flex-shrink-0">
                                                {getRelativeTime(
                                                    activity.timestamp
                                                )}
                                            </span>
                                        </div>

                                        {/* Metadata (if available) */}
                                        {activity.metadata && (
                                            <div className="flex items-center gap-3 text-[11px] text-black/40 pl-8 mt-1">
                                                {activity.metadata
                                                    .clientName && (
                                                    <span className="flex items-center gap-1">
                                                        <User
                                                            className="w-3 h-3"
                                                            strokeWidth={2}
                                                        />
                                                        {
                                                            activity.metadata
                                                                .clientName
                                                        }
                                                    </span>
                                                )}
                                                {activity.metadata.amount && (
                                                    <span className="flex items-center gap-1 font-medium text-black/60">
                                                        {formatCurrency(
                                                            activity.metadata
                                                                .amount
                                                        )}
                                                    </span>
                                                )}
                                                {activity.metadata
                                                    .documentNumber && (
                                                    <span className="flex items-center gap-1">
                                                        <FileText
                                                            className="w-3 h-3"
                                                            strokeWidth={2}
                                                        />
                                                        {
                                                            activity.metadata
                                                                .documentNumber
                                                        }
                                                    </span>
                                                )}
                                                {activity.metadata
                                                    .productName && (
                                                    <span className="flex items-center gap-1">
                                                        <Package
                                                            className="w-3 h-3"
                                                            strokeWidth={2}
                                                        />
                                                        {
                                                            activity.metadata
                                                                .productName
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Card>
    );
}
