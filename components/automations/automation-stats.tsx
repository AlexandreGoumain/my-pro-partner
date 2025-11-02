import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Pause, Play, Zap } from "lucide-react";

export interface AutomationStatsProps {
    total: number;
    active: number;
    inactive: number;
    totalExecutions: number;
}

export function AutomationStats({
    total,
    active,
    inactive,
    totalExecutions,
}: AutomationStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">Total</p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {total}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-black/60" strokeWidth={2} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">Actives</p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {active}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-green-500/10 flex items-center justify-center">
                            <Play className="h-6 w-6 text-green-600" strokeWidth={2} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">Inactives</p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {inactive}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                            <Pause className="h-6 w-6 text-black/40" strokeWidth={2} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">
                                Exécutions
                            </p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {totalExecutions}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                            <ArrowRight
                                className="h-6 w-6 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
