import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Capability } from "@/lib/types/capability";
import { Award, FileText, Calendar, Wrench, Plus } from "lucide-react";
import Link from "next/link";

export interface QuickActionsCardProps {
    className?: string;
    capabilities?: Capability[];
}

function hasCapability(capabilities: Capability[], cap: Capability): boolean {
    return capabilities.includes(cap);
}

function hasAnyCapability(capabilities: Capability[], caps: Capability[]): boolean {
    return caps.some((cap) => capabilities.includes(cap));
}

export function QuickActionsCard({ className, capabilities = [] }: QuickActionsCardProps) {
    const showRdvAction = hasCapability(capabilities, "agenda");
    const showInterventionAction = hasAnyCapability(capabilities, ["domicile", "atelier"]);

    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-6">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-4">
                    Actions rapides
                </h2>
                <div className="flex flex-wrap gap-3">
                    {showRdvAction && (
                        <Link href="/client/rdv/nouveau">
                            <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white">
                                <Plus
                                    className="h-4 w-4 mr-2"
                                    strokeWidth={2}
                                />
                                Prendre RDV
                            </Button>
                        </Link>
                    )}
                    {showInterventionAction && (
                        <Link href="/client/interventions">
                            <Button
                                variant="outline"
                                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <Wrench
                                    className="h-4 w-4 mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Mes interventions
                                </span>
                            </Button>
                        </Link>
                    )}
                    {showRdvAction && (
                        <Link href="/client/rdv">
                            <Button
                                variant="outline"
                                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <Calendar
                                    className="h-4 w-4 mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Mes rendez-vous
                                </span>
                            </Button>
                        </Link>
                    )}
                    <Link href="/client/fidelite">
                        <Button
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Award
                                className="h-4 w-4 mr-2 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-black/80">
                                Voir ma fidélité
                            </span>
                        </Button>
                    </Link>
                    <Link href="/client/documents">
                        <Button
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <FileText
                                className="h-4 w-4 mr-2 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-black/80">Mes documents</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
