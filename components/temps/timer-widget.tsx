"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useActiveTimer,
    useCancelTimer,
    useStartTimer,
    useStopTimer,
} from "@/hooks/use-temps";
import type { Mission } from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { Clock, Loader2, Play, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface TimerWidgetProps {
    missions: Mission[];
    className?: string;
}

export function TimerWidget({ missions, className }: TimerWidgetProps) {
    const { data: activeTimer, isLoading: timerLoading } = useActiveTimer();
    const startTimer = useStartTimer();
    const stopTimer = useStopTimer();
    const cancelTimer = useCancelTimer();

    const [selectedMission, setSelectedMission] = useState<string>("");
    const [description, setDescription] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0);

    // Calculate elapsed time for running timer
    useEffect(() => {
        if (!activeTimer?.timerStart) {
            setElapsedTime(0);
            return;
        }

        const startTime = new Date(activeTimer.timerStart).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000 / 60); // minutes
            setElapsedTime(elapsed);
        }, 1000);

        // Initial calculation
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000 / 60);
        setElapsedTime(elapsed);

        return () => clearInterval(interval);
    }, [activeTimer?.timerStart]);

    const formatElapsed = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const secs = Math.floor(
            ((Date.now() - new Date(activeTimer?.timerStart || 0).getTime()) /
                1000) %
                60
        );

        return `${hours.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStart = () => {
        if (!selectedMission) return;

        startTimer.mutate({
            missionId: selectedMission,
            description: description || undefined,
        });
    };

    const handleStop = () => {
        stopTimer.mutate(description || undefined);
        setDescription("");
    };

    const handleCancel = () => {
        cancelTimer.mutate();
        setDescription("");
    };

    if (timerLoading) {
        return (
            <Card className={cn("p-4 border-black/8", className)}>
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-black/40" />
                </div>
            </Card>
        );
    }

    // Active timer view
    if (activeTimer?.timerStart) {
        const mission = missions.find((m) => m.id === activeTimer.missionId);

        return (
            <Card className={cn("p-4 border-black/20 bg-black/2", className)}>
                <div className="space-y-4">
                    {/* Timer display */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-black/60 animate-pulse" />
                            </div>
                            <div>
                                <div className="text-[12px] text-black/40">
                                    Timer en cours
                                </div>
                                <div className="text-[24px] font-mono font-semibold tracking-tight">
                                    {formatElapsed(elapsedTime)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCancel}
                                disabled={cancelTimer.isPending}
                                className="h-10 w-10 border-black/10 hover:bg-black/5"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleStop}
                                disabled={stopTimer.isPending}
                                className="h-10 px-4 bg-black hover:bg-black/90"
                            >
                                {stopTimer.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Square className="h-4 w-4 mr-2" />
                                        Arrêter
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mission info */}
                    {mission && (
                        <div className="text-[13px] text-black/60">
                            <span className="font-medium">
                                {mission.numero}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{mission.nom}</span>
                            <span className="mx-2">•</span>
                            <span className="text-black/40">
                                {mission.client.nom}
                            </span>
                        </div>
                    )}

                    {/* Description input */}
                    <Input
                        placeholder="Qu'avez-vous fait ?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-10"
                    />
                </div>
            </Card>
        );
    }

    // Start timer view
    return (
        <Card className={cn("p-4 border-black/8", className)}>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-black/40" />
                    </div>
                    <div>
                        <div className="text-[14px] font-medium text-black/80">
                            Démarrer le timer
                        </div>
                        <div className="text-[12px] text-black/40">
                            Sélectionnez une mission et commencez à tracker
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                    <Select
                        value={selectedMission}
                        onValueChange={setSelectedMission}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Sélectionner une mission" />
                        </SelectTrigger>
                        <SelectContent>
                            {missions
                                .filter((m) => m.statut === "EN_COURS")
                                .map((mission) => (
                                    <SelectItem
                                        key={mission.id}
                                        value={mission.id}
                                    >
                                        {mission.numero} - {mission.nom}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Description (optionnel)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-10"
                    />

                    <Button
                        onClick={handleStart}
                        disabled={!selectedMission || startTimer.isPending}
                        className="h-10 px-6 bg-black hover:bg-black/90"
                    >
                        {startTimer.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Démarrer
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
