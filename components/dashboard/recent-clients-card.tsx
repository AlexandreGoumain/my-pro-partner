import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ClientListItem, ClientListItemProps } from "./client-list-item";
import { cn } from "@/lib/utils";

export interface RecentClientsCardProps {
    clients: ClientListItemProps[];
    onViewAll?: () => void;
    className?: string;
}

export function RecentClientsCard({
    clients,
    onViewAll,
    className,
}: RecentClientsCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                        Derniers clients
                    </h3>
                    {onViewAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[13px] text-black/60 hover:text-black hover:bg-black/5"
                            onClick={onViewAll}
                        >
                            Voir tout
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" strokeWidth={2} />
                        </Button>
                    )}
                </div>

                {clients.length > 0 ? (
                    <div className="space-y-2">
                        {clients.map((client, index) => (
                            <ClientListItem key={index} {...client} />
                        ))}
                    </div>
                ) : (
                    <p className="text-[14px] text-black/40 text-center py-8">
                        Aucun client
                    </p>
                )}
            </div>
        </Card>
    );
}
