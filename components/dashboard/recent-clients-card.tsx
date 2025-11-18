import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ClientListItem, ClientListItemProps } from "./client-list-item";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface RecentClientsCardProps {
    clients: ClientListItemProps[];
    onViewAll?: () => void;
    className?: string;
}

/**
 * RecentClientsCard component
 *
 * Card displaying recent clients with optional "View all" action.
 * Uses Design System constants for consistent styling.
 */
export function RecentClientsCard({
    clients,
    onViewAll,
    className,
}: RecentClientsCardProps) {
    return (
        <Card className={cn(DS.component.card.default, className)}>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={DS.text.heading.h4}>
                        Derniers clients
                    </h3>
                    {onViewAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 px-2",
                                DS.text.body.small,
                                DS.color.text.secondary,
                                "hover:text-black",
                                "hover:bg-black/5"
                            )}
                            onClick={onViewAll}
                        >
                            Voir tout
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" strokeWidth={DS.size.icon.strokeWidth} />
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
                    <p className={cn(DS.text.body.base, DS.color.text.tertiary, "text-center py-8")}>
                        Aucun client
                    </p>
                )}
            </div>
        </Card>
    );
}
