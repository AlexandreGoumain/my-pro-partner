import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TriggerConfig } from "@/hooks/use-automations";
import { Zap } from "lucide-react";

interface Segment {
    id: string;
    nom: string;
}

const triggerTypes = [
    { value: "NEW_CLIENT_IN_SEGMENT", label: "Nouveau client dans segment" },
    { value: "CLIENT_MILESTONE", label: "Jalon client" },
    { value: "SEGMENT_CHANGE", label: "Changement de segment" },
    { value: "INACTIVITY", label: "Inactivité" },
    { value: "SCHEDULED", label: "Planifié" },
];

interface TriggerConfigSectionProps {
    triggerType: string;
    setTriggerType: (type: string) => void;
    triggerConfig: TriggerConfig;
    setTriggerConfig: (config: TriggerConfig) => void;
    segments: Segment[];
}

export function TriggerConfigSection({
    triggerType,
    setTriggerType,
    triggerConfig,
    setTriggerConfig,
    segments,
}: TriggerConfigSectionProps) {
    const renderTriggerConfig = () => {
        switch (triggerType) {
            case "NEW_CLIENT_IN_SEGMENT":
            case "SEGMENT_CHANGE":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Segment
                        </Label>
                        <Select
                            value={triggerConfig.segmentId || ""}
                            onValueChange={(value) =>
                                setTriggerConfig({
                                    ...triggerConfig,
                                    segmentId: value,
                                })
                            }
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                <SelectValue placeholder="Sélectionner un segment" />
                            </SelectTrigger>
                            <SelectContent>
                                {segments.map((segment) => (
                                    <SelectItem
                                        key={segment.id}
                                        value={segment.id}
                                    >
                                        {segment.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            case "CLIENT_MILESTONE":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Type de jalon
                        </Label>
                        <Select
                            value={
                                (triggerConfig.milestoneType as string) || ""
                            }
                            onValueChange={(value) =>
                                setTriggerConfig({
                                    ...triggerConfig,
                                    milestoneType: value,
                                })
                            }
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                <SelectValue placeholder="Sélectionner un jalon" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="POINTS_THRESHOLD">
                                    Seuil de points
                                </SelectItem>
                                <SelectItem value="PURCHASE_COUNT">
                                    Nombre d&apos;achats
                                </SelectItem>
                                <SelectItem value="TOTAL_SPENT">
                                    Montant total dépensé
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {Boolean(triggerConfig.milestoneType) && (
                            <div className="mt-4">
                                <Label className="text-[13px] font-medium text-black/80">
                                    Valeur seuil
                                </Label>
                                <Input
                                    type="number"
                                    value={
                                        (triggerConfig.threshold as number) ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setTriggerConfig({
                                            ...triggerConfig,
                                            threshold: parseInt(e.target.value),
                                        })
                                    }
                                    className="h-11 border-black/10 text-[14px] mt-2"
                                    placeholder="Ex: 100"
                                />
                            </div>
                        )}
                    </div>
                );

            case "INACTIVITY":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Nombre de jours d&apos;inactivité
                        </Label>
                        <Input
                            type="number"
                            value={(triggerConfig.days as number) || ""}
                            onChange={(e) =>
                                setTriggerConfig({
                                    ...triggerConfig,
                                    days: parseInt(e.target.value),
                                })
                            }
                            className="h-11 border-black/10 text-[14px]"
                            placeholder="Ex: 30"
                        />
                    </div>
                );

            case "SCHEDULED":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Fréquence
                        </Label>
                        <Select
                            value={(triggerConfig.frequency as string) || ""}
                            onValueChange={(value) =>
                                setTriggerConfig({
                                    ...triggerConfig,
                                    frequency: value,
                                })
                            }
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                <SelectValue placeholder="Sélectionner une fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Quotidien</SelectItem>
                                <SelectItem value="WEEKLY">
                                    Hebdomadaire
                                </SelectItem>
                                <SelectItem value="MONTHLY">Mensuel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="border border-black/10 rounded-lg p-6 bg-black/2">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-black/60" strokeWidth={2} />
                <h3 className="text-[15px] font-medium text-black">
                    Déclencheur
                </h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Type de déclencheur *
                    </Label>
                    <Select value={triggerType} onValueChange={setTriggerType}>
                        <SelectTrigger className="h-11 border-black/10 text-[14px] bg-white">
                            <SelectValue placeholder="Sélectionner un déclencheur" />
                        </SelectTrigger>
                        <SelectContent>
                            {triggerTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {triggerType && renderTriggerConfig()}
            </div>
        </div>
    );
}
