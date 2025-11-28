import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActionConfig } from "@/hooks/use-automations";
import { ArrowRight } from "lucide-react";

interface Segment {
    id: string;
    nom: string;
}

const actionTypes = [
    { value: "SEND_EMAIL", label: "Envoyer email" },
    { value: "ADD_TO_SEGMENT", label: "Ajouter au segment" },
    { value: "REMOVE_FROM_SEGMENT", label: "Retirer du segment" },
    { value: "ADD_POINTS", label: "Ajouter des points" },
    { value: "SEND_SMS", label: "Envoyer SMS" },
    { value: "CREATE_TASK", label: "Créer une tâche" },
];

interface ActionConfigSectionProps {
    actionType: string;
    setActionType: (type: string) => void;
    actionConfig: ActionConfig;
    setActionConfig: (config: ActionConfig) => void;
    segments: Segment[];
}

export function ActionConfigSection({
    actionType,
    setActionType,
    actionConfig,
    setActionConfig,
    segments,
}: ActionConfigSectionProps) {
    const renderActionConfig = () => {
        switch (actionType) {
            case "SEND_EMAIL":
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Sujet de l&apos;email
                            </Label>
                            <Input
                                value={actionConfig.subject || ""}
                                onChange={(e) =>
                                    setActionConfig({
                                        ...actionConfig,
                                        subject: e.target.value,
                                    })
                                }
                                className="h-11 border-black/10 text-[14px]"
                                placeholder="Sujet de l'email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Corps de l&apos;email
                            </Label>
                            <Textarea
                                value={actionConfig.body || ""}
                                onChange={(e) =>
                                    setActionConfig({
                                        ...actionConfig,
                                        body: e.target.value,
                                    })
                                }
                                className="min-h-[120px] border-black/10 text-[14px]"
                                placeholder="Bonjour {prenom}, ..."
                            />
                            <p className="text-[12px] text-black/60">
                                Variables disponibles: {"{nom}"}, {"{prenom}"},{" "}
                                {"{email}"}
                            </p>
                        </div>
                    </div>
                );

            case "SEND_SMS":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Message SMS
                        </Label>
                        <Textarea
                            value={actionConfig.message || ""}
                            onChange={(e) =>
                                setActionConfig({
                                    ...actionConfig,
                                    message: e.target.value,
                                })
                            }
                            className="min-h-[100px] border-black/10 text-[14px]"
                            placeholder="Bonjour {prenom}, ..."
                            maxLength={160}
                        />
                        <p className="text-[12px] text-black/60">
                            {actionConfig.message?.length || 0}/160 caractères
                        </p>
                    </div>
                );

            case "ADD_TO_SEGMENT":
            case "REMOVE_FROM_SEGMENT":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Segment cible
                        </Label>
                        <Select
                            value={actionConfig.segmentId || ""}
                            onValueChange={(value) =>
                                setActionConfig({
                                    ...actionConfig,
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

            case "ADD_POINTS":
                return (
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Nombre de points
                        </Label>
                        <Input
                            type="number"
                            value={(actionConfig.points as number) || ""}
                            onChange={(e) =>
                                setActionConfig({
                                    ...actionConfig,
                                    points: parseInt(e.target.value),
                                })
                            }
                            className="h-11 border-black/10 text-[14px]"
                            placeholder="Ex: 50"
                        />
                    </div>
                );

            case "CREATE_TASK":
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Titre de la tâche
                            </Label>
                            <Input
                                value={actionConfig.title || ""}
                                onChange={(e) =>
                                    setActionConfig({
                                        ...actionConfig,
                                        title: e.target.value,
                                    })
                                }
                                className="h-11 border-black/10 text-[14px]"
                                placeholder="Titre de la tâche"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Description
                            </Label>
                            <Textarea
                                value={
                                    (actionConfig.description as string) || ""
                                }
                                onChange={(e) =>
                                    setActionConfig({
                                        ...actionConfig,
                                        description: e.target.value,
                                    })
                                }
                                className="min-h-[80px] border-black/10 text-[14px]"
                                placeholder="Description de la tâche"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="border border-black/10 rounded-lg p-6 bg-black/2">
            <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="h-5 w-5 text-black/60" strokeWidth={2} />
                <h3 className="text-[15px] font-medium text-black">Action</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Type d&apos;action *
                    </Label>
                    <Select value={actionType} onValueChange={setActionType}>
                        <SelectTrigger className="h-11 border-black/10 text-[14px] bg-white">
                            <SelectValue placeholder="Sélectionner une action" />
                        </SelectTrigger>
                        <SelectContent>
                            {actionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {actionType && renderActionConfig()}
            </div>
        </div>
    );
}
