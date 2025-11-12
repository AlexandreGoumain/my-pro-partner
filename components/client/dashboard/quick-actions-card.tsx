import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, FileText } from "lucide-react";
import Link from "next/link";

export interface QuickActionsCardProps {
    className?: string;
}

export function QuickActionsCard({ className }: QuickActionsCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-6">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-4">
                    Actions rapides
                </h2>
                <div className="flex flex-wrap gap-3">
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
