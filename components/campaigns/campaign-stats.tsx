import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, Calendar, CheckCircle2 } from "lucide-react";

export interface CampaignStatsProps {
    total: number;
    draft: number;
    scheduled: number;
    sent: number;
}

export function CampaignStats({
    total,
    draft,
    scheduled,
    sent,
}: CampaignStatsProps) {
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
                            <Mail className="h-6 w-6 text-black/60" strokeWidth={2} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">
                                Brouillons
                            </p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {draft}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-black/60" strokeWidth={2} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">
                                Planifiées
                            </p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {scheduled}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-blue-500/10 flex items-center justify-center">
                            <Calendar
                                className="h-6 w-6 text-blue-600"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[13px] text-black/60 mb-1">Envoyées</p>
                            <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                {sent}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-md bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2
                                className="h-6 w-6 text-green-600"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
