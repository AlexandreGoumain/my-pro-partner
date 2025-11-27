"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { Skeleton } from "@/components/ui/skeleton";
import {
    usePlanning,
    useUpdateIntervention,
    type PlombierPlanning,
} from "@/hooks/use-interventions";
import type { Intervention } from "@/lib/types/intervention";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, Plus, User } from "lucide-react";
import { useCallback, useState } from "react";
import { DraggableIntervention } from "./draggable-intervention";

interface DayViewProps {
    selectedDate: Date;
    selectedPlombier?: string;
    onNewIntervention?: () => void;
}

function DroppablePlombierZone({
    plombier,
    children,
}: {
    plombier: PlombierPlanning;
    children: React.ReactNode;
}) {
    const { isOver, setNodeRef } = useDroppable({
        id: `plombier-${plombier.id}`,
        data: { plombierId: plombier.id },
    });

    return (
        <div
            ref={setNodeRef}
            className={`p-5 rounded-xl bg-white border shadow-sm transition-all duration-200 ${
                isOver
                    ? "border-black/30 ring-2 ring-black/10 bg-black/[0.02]"
                    : "border-black/8"
            }`}
        >
            {children}
        </div>
    );
}

export function DayView({
    selectedDate,
    selectedPlombier,
    onNewIntervention,
}: DayViewProps) {
    const dateString = format(selectedDate, "yyyy-MM-dd");
    const queryClient = useQueryClient();

    const { data: plombiers = [], isLoading } = usePlanning(
        dateString,
        selectedPlombier !== "ALL" ? selectedPlombier : undefined
    );

    const updateIntervention = useUpdateIntervention();
    const [activeIntervention, setActiveIntervention] = useState<
        (Intervention & { dureeEstimeeH?: number }) | null
    >(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findIntervention = useCallback(
        (id: string): (Intervention & { dureeEstimeeH?: number }) | null => {
            for (const plombier of plombiers) {
                const intervention = plombier.interventions.find(
                    (i) => i.id === id
                );
                if (intervention)
                    return intervention as Intervention & {
                        dureeEstimeeH?: number;
                    };
            }
            return null;
        },
        [plombiers]
    );

    const findPlombierByIntervention = useCallback(
        (interventionId: string): string | null => {
            for (const plombier of plombiers) {
                const intervention = plombier.interventions.find(
                    (i) => i.id === interventionId
                );
                if (intervention) return plombier.id;
            }
            return null;
        },
        [plombiers]
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const intervention = findIntervention(active.id as string);
        setActiveIntervention(intervention);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveIntervention(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Get the target plombier
        let targetPlombierId: string | null = null;

        if (overId.startsWith("plombier-")) {
            targetPlombierId = overId.replace("plombier-", "");
        } else {
            // Dropped on another intervention - find its plombier
            targetPlombierId = findPlombierByIntervention(overId);
        }

        const currentPlombierId = findPlombierByIntervention(activeId);

        // If moving to a different plombier, update the intervention
        if (targetPlombierId && targetPlombierId !== currentPlombierId) {
            try {
                await updateIntervention.mutateAsync({
                    id: activeId,
                    data: { plombierId: targetPlombierId },
                });
            } catch (error) {
                console.error("Failed to update intervention:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] rounded-xl" />
                ))}
            </div>
        );
    }

    if (plombiers.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="Aucune intervention planifiée"
                description="Planifiez votre première intervention"
                action={
                    onNewIntervention
                        ? {
                              label: "Planifier une tournée",
                              onClick: onNewIntervention,
                              icon: Plus,
                          }
                        : undefined
                }
                variant="dashed"
            />
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-4">
                {plombiers.map((plombier) => (
                    <DroppablePlombierZone
                        key={plombier.id}
                        plombier={plombier}
                    >
                        {/* Plombier Header */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/8">
                            <div className="flex items-center gap-3">
                                <IconBox
                                    icon={User}
                                    shape="circle"
                                    bgColor="bg-black/5"
                                    iconColor="text-black/60"
                                />
                                <div>
                                    <h3 className="text-[16px] font-semibold text-black">
                                        {plombier.name}
                                    </h3>
                                    <p className="text-[13px] text-black/50">
                                        {plombier.interventionsCount}{" "}
                                        intervention
                                        {plombier.interventionsCount > 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-black/50">
                                <Clock className="w-4 h-4" strokeWidth={2} />
                                <span>
                                    {plombier.interventions
                                        .reduce(
                                            (sum, i) =>
                                                sum +
                                                ((i as any).dureeEstimeeH || 0),
                                            0
                                        )
                                        .toFixed(1)}
                                    h estimées
                                </span>
                            </div>
                        </div>

                        {/* Interventions Timeline */}
                        <SortableContext
                            items={plombier.interventions.map((i) => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 min-h-[60px]">
                                {plombier.interventions.length === 0 ? (
                                    <p className="text-[13px] text-black/40 text-center py-4">
                                        Glissez une intervention ici
                                    </p>
                                ) : (
                                    plombier.interventions.map(
                                        (intervention) => (
                                            <DraggableIntervention
                                                key={intervention.id}
                                                intervention={
                                                    intervention as Intervention & {
                                                        dureeEstimeeH?: number;
                                                    }
                                                }
                                            />
                                        )
                                    )
                                )}
                            </div>
                        </SortableContext>
                    </DroppablePlombierZone>
                ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeIntervention ? (
                    <div className="opacity-90">
                        <DraggableIntervention
                            intervention={activeIntervention}
                            isDragging
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
