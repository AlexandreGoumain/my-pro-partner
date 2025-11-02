import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsNavigationTabsProps {
    onNavigateToClients?: () => void;
    onNavigateToStock?: () => void;
    className?: string;
}

export function StatsNavigationTabs({
    onNavigateToClients,
    onNavigateToStock,
    className,
}: StatsNavigationTabsProps) {
    return (
        <Tabs defaultValue="clients" className={cn("space-y-5", className)}>
            <TabsList className="bg-black/5 border-black/10">
                <TabsTrigger
                    value="clients"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                >
                    Statistiques Clients
                </TabsTrigger>
                <TabsTrigger
                    value="articles"
                    className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                >
                    Statistiques Articles
                </TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
                <Card className="border-black/8 shadow-sm">
                    <div className="p-4">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                            onClick={onNavigateToClients}
                        >
                            <span className="text-black/80">
                                Voir les statistiques clients détaillées
                            </span>
                            <ArrowUpRight
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                        </Button>
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="articles">
                <Card className="border-black/8 shadow-sm">
                    <div className="p-4">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                            onClick={onNavigateToStock}
                        >
                            <span className="text-black/80">Voir la gestion du stock</span>
                            <ArrowUpRight
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                        </Button>
                    </div>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
