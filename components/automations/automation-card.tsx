import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { Automation } from "@/hooks/use-automations";
import {
    ACTION_TYPE_LABELS,
    TRIGGER_TYPE_LABELS,
} from "@/lib/constants/automation-config";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

export interface AutomationCardProps {
    automation: Automation;
    onToggle: (id: string, currentState: boolean) => void;
    onEdit: (automation: Automation) => void;
    onDelete: (id: string, nom: string) => void;
}

export function AutomationCard({
    automation,
    onToggle,
    onEdit,
    onDelete,
}: AutomationCardProps) {
    return (
        <Card className="border-black/10 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Switch
                            checked={automation.actif}
                            onCheckedChange={() =>
                                onToggle(automation.id, automation.actif)
                            }
                            className="data-[state=checked]:bg-black"
                        />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-[15px] font-medium text-black">
                                    {automation.nom}
                                </h3>
                                {automation.actif ? (
                                    <Badge className="bg-green-500/10 text-green-700 border-0 text-[12px] font-medium">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge className="bg-black/5 text-black/60 border-0 text-[12px] font-medium">
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            {automation.description && (
                                <p className="text-[13px] text-black/60 mb-3">
                                    {automation.description}
                                </p>
                            )}

                            <div className="flex items-center gap-6 text-[13px] text-black/60">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-black/80">
                                        Déclencheur:
                                    </span>
                                    <span>
                                        {TRIGGER_TYPE_LABELS[automation.triggerType] ||
                                            automation.triggerType}
                                    </span>
                                </div>

                                <div className="h-4 w-px bg-black/10" />

                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-black/80">
                                        Action:
                                    </span>
                                    <span>
                                        {ACTION_TYPE_LABELS[automation.actionType] ||
                                            automation.actionType}
                                    </span>
                                </div>

                                <div className="h-4 w-px bg-black/10" />

                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-black/80">
                                        Exécutions:
                                    </span>
                                    <span>{automation.nombreExecutions}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-black/10 hover:bg-black/5"
                            >
                                <MoreVertical
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => onEdit(automation)}
                                className="text-[14px]"
                            >
                                <Edit
                                    className="h-4 w-4 mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    onDelete(automation.id, automation.nom)
                                }
                                className="text-[14px] text-red-600"
                            >
                                <Trash2
                                    className="h-4 w-4 mr-2"
                                    strokeWidth={2}
                                />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
