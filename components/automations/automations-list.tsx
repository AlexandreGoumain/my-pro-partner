import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Automation } from "@/hooks/use-automations";
import { Plus, Zap } from "lucide-react";
import { AutomationCard } from "./automation-card";

export interface AutomationsListProps {
    automations: Automation[];
    onToggle: (id: string, currentState: boolean) => void;
    onEdit: (automation: Automation) => void;
    onDelete: (id: string, nom: string) => void;
    onCreate: () => void;
}

export function AutomationsList({
    automations,
    onToggle,
    onEdit,
    onDelete,
    onCreate,
}: AutomationsListProps) {
    if (automations.length === 0) {
        return (
            <Card className="border-black/10 shadow-sm">
                <CardContent className="p-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-black/5 mx-auto mb-4 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-black/40" strokeWidth={2} />
                    </div>
                    <h3 className="text-[16px] font-medium text-black mb-2">
                        Aucune automation
                    </h3>
                    <p className="text-[14px] text-black/60 mb-6 max-w-md mx-auto">
                        Créez votre première automation pour automatiser vos
                        actions marketing
                    </p>
                    <Button
                        onClick={onCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Créer une automation
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {automations.map((automation) => (
                <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
