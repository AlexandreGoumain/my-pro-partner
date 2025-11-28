"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Wrench } from "lucide-react";

interface RepairEmptyStateProps {
    onCreateClick?: () => void;
}

export function RepairEmptyState({ onCreateClick }: RepairEmptyStateProps) {
    return (
        <EmptyState
            icon={Wrench}
            title="Aucune réparation"
            description="Commencez à suivre vos réparations en créant votre premier ticket de réparation."
            variant="dashed"
            iconSize="lg"
            action={
                onCreateClick
                    ? {
                          label: "Nouvelle réparation",
                          onClick: onCreateClick,
                          icon: Wrench,
                      }
                    : undefined
            }
        />
    );
}
