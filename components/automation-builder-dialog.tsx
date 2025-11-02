"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSegments } from "@/hooks/use-segments";
import { useCreateAutomation, useUpdateAutomation } from "@/hooks/use-automations";
import { toast } from "sonner";
import { Zap, ArrowRight } from "lucide-react";

interface AutomationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation?: any;
}

const triggerTypes = [
  { value: "NEW_CLIENT_IN_SEGMENT", label: "Nouveau client dans segment" },
  { value: "CLIENT_MILESTONE", label: "Jalon client" },
  { value: "SEGMENT_CHANGE", label: "Changement de segment" },
  { value: "INACTIVITY", label: "Inactivité" },
  { value: "SCHEDULED", label: "Planifié" },
];

const actionTypes = [
  { value: "SEND_EMAIL", label: "Envoyer email" },
  { value: "ADD_TO_SEGMENT", label: "Ajouter au segment" },
  { value: "REMOVE_FROM_SEGMENT", label: "Retirer du segment" },
  { value: "ADD_POINTS", label: "Ajouter des points" },
  { value: "SEND_SMS", label: "Envoyer SMS" },
  { value: "CREATE_TASK", label: "Créer une tâche" },
];

export function AutomationBuilderDialog({
  open,
  onOpenChange,
  automation,
}: AutomationBuilderDialogProps) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("");
  const [actionType, setActionType] = useState("");
  const [triggerConfig, setTriggerConfig] = useState<any>({});
  const [actionConfig, setActionConfig] = useState<any>({});

  const { data: segmentsData } = useSegments({ actif: true });
  const segments = segmentsData?.data || [];

  const createAutomation = useCreateAutomation();
  const updateAutomation = useUpdateAutomation();

  useEffect(() => {
    if (automation) {
      setNom(automation.nom);
      setDescription(automation.description || "");
      setTriggerType(automation.triggerType);
      setActionType(automation.actionType);
      setTriggerConfig(automation.triggerConfig || {});
      setActionConfig(automation.actionConfig || {});
    } else {
      setNom("");
      setDescription("");
      setTriggerType("");
      setActionType("");
      setTriggerConfig({});
      setActionConfig({});
    }
  }, [automation, open]);

  const handleSubmit = async () => {
    if (!nom || !triggerType || !actionType) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      const data = {
        nom,
        description,
        triggerType,
        triggerConfig,
        actionType,
        actionConfig,
        actif: true,
      };

      if (automation) {
        await updateAutomation.mutateAsync({ id: automation.id, data });
        toast.success("Automation mise à jour");
      } else {
        await createAutomation.mutateAsync(data);
        toast.success("Automation créée");
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

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
                setTriggerConfig({ ...triggerConfig, segmentId: value })
              }
            >
              <SelectTrigger className="h-11 border-black/10 text-[14px]">
                <SelectValue placeholder="Sélectionner un segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
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
              value={triggerConfig.milestoneType || ""}
              onValueChange={(value) =>
                setTriggerConfig({ ...triggerConfig, milestoneType: value })
              }
            >
              <SelectTrigger className="h-11 border-black/10 text-[14px]">
                <SelectValue placeholder="Sélectionner un jalon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POINTS_THRESHOLD">Seuil de points</SelectItem>
                <SelectItem value="PURCHASE_COUNT">Nombre d'achats</SelectItem>
                <SelectItem value="TOTAL_SPENT">Montant total dépensé</SelectItem>
              </SelectContent>
            </Select>

            {triggerConfig.milestoneType && (
              <div className="mt-4">
                <Label className="text-[13px] font-medium text-black/80">
                  Valeur seuil
                </Label>
                <Input
                  type="number"
                  value={triggerConfig.threshold || ""}
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
              Nombre de jours d'inactivité
            </Label>
            <Input
              type="number"
              value={triggerConfig.days || ""}
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
              value={triggerConfig.frequency || ""}
              onValueChange={(value) =>
                setTriggerConfig({ ...triggerConfig, frequency: value })
              }
            >
              <SelectTrigger className="h-11 border-black/10 text-[14px]">
                <SelectValue placeholder="Sélectionner une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Quotidien</SelectItem>
                <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                <SelectItem value="MONTHLY">Mensuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const renderActionConfig = () => {
    switch (actionType) {
      case "SEND_EMAIL":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Sujet de l'email
              </Label>
              <Input
                value={actionConfig.subject || ""}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, subject: e.target.value })
                }
                className="h-11 border-black/10 text-[14px]"
                placeholder="Sujet de l'email"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Corps de l'email
              </Label>
              <Textarea
                value={actionConfig.body || ""}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, body: e.target.value })
                }
                className="min-h-[120px] border-black/10 text-[14px]"
                placeholder="Bonjour {prenom}, ..."
              />
              <p className="text-[12px] text-black/60">
                Variables disponibles: {"{nom}"}, {"{prenom}"}, {"{email}"}
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
                setActionConfig({ ...actionConfig, message: e.target.value })
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
                setActionConfig({ ...actionConfig, segmentId: value })
              }
            >
              <SelectTrigger className="h-11 border-black/10 text-[14px]">
                <SelectValue placeholder="Sélectionner un segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
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
              value={actionConfig.points || ""}
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
                  setActionConfig({ ...actionConfig, title: e.target.value })
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
                value={actionConfig.description || ""}
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
            {automation ? "Modifier l'automation" : "Nouvelle automation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Nom de l'automation *
              </Label>
              <Input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="h-11 border-black/10 text-[14px]"
                placeholder="Ex: Bienvenue nouveaux VIP"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] border-black/10 text-[14px]"
                placeholder="Description de l'automation"
              />
            </div>
          </div>

          {/* Trigger */}
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

          {/* Arrow */}
          {triggerType && actionType && (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-black/60" strokeWidth={2} />
              </div>
            </div>
          )}

          {/* Action */}
          <div className="border border-black/10 rounded-lg p-6 bg-black/2">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="h-5 w-5 text-black/60" strokeWidth={2} />
              <h3 className="text-[15px] font-medium text-black">Action</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Type d'action *
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              createAutomation.isPending || updateAutomation.isPending
            }
            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
          >
            {automation ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
