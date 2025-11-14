"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSegments } from "@/hooks/use-segments";
import {
  Campaign,
  useCreateCampaign,
  useUpdateCampaign,
  useScheduleCampaign,
} from "@/hooks/use-campaigns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Send, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CampaignSchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
}

export function CampaignSchedulerDialog({
  open,
  onOpenChange,
  campaign,
}: CampaignSchedulerDialogProps) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"EMAIL" | "SMS" | "NOTIFICATION">("EMAIL");
  const [segmentId, setSegmentId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [scheduledTime, setScheduledTime] = useState("09:00");

  const { data: segmentsData } = useSegments({ actif: true });
  const segments = segmentsData?.data || [];

  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const scheduleCampaign = useScheduleCampaign();

  useEffect(() => {
    if (campaign) {
      setNom(campaign.nom);
      setDescription(campaign.description || "");
      setType(campaign.type);
      setSegmentId(campaign.segmentId || "");
      setSubject(campaign.subject || "");
      setBody(campaign.body || "");

      if (campaign.scheduledAt) {
        const date = new Date(campaign.scheduledAt);
        setScheduledDate(date);
        setScheduledTime(format(date, "HH:mm"));
      } else {
        setScheduledDate(undefined);
        setScheduledTime("09:00");
      }
    } else {
      setNom("");
      setDescription("");
      setType("EMAIL");
      setSegmentId("");
      setSubject("");
      setBody("");
      setScheduledDate(undefined);
      setScheduledTime("09:00");
    }
  }, [campaign, open]);

  const selectedSegment = segments.find((s) => s.id === segmentId);

  const handleSaveDraft = async () => {
    if (!nom) {
      toast.error("Veuillez saisir un nom");
      return;
    }

    try {
      const data = {
        nom,
        description,
        type,
        segmentId: segmentId || undefined,
        subject: type === "EMAIL" ? subject : undefined,
        body,
      };

      if (campaign) {
        await updateCampaign.mutateAsync({ id: campaign.id, data });
        toast.success("Campagne mise à jour");
      } else {
        await createCampaign.mutateAsync(data);
        toast.success("Campagne sauvegardée en brouillon");
      }

      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      toast.error(errorMessage);
    }
  };

  const handleSchedule = async () => {
    if (!nom || !subject || !body) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    if (!scheduledDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    try {
      // Combine date and time
      const [hours, minutes] = scheduledTime.split(":");
      const scheduledAt = new Date(scheduledDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const data = {
        nom,
        description,
        type,
        segmentId: segmentId || undefined,
        subject: type === "EMAIL" ? subject : undefined,
        body,
        scheduledAt: scheduledAt.toISOString(),
      };

      if (campaign) {
        // Update existing campaign
        await updateCampaign.mutateAsync({ id: campaign.id, data });
        // Then schedule it
        await scheduleCampaign.mutateAsync({
          id: campaign.id,
          scheduledAt: scheduledAt.toISOString(),
        });
        toast.success("Campagne planifiée");
      } else {
        // Create new campaign with schedule
        await createCampaign.mutateAsync(data);
        toast.success("Campagne créée et planifiée");
      }

      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la planification";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
            {campaign ? "Modifier la campagne" : "Nouvelle campagne"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Nom de la campagne *
              </Label>
              <Input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="h-11 border-black/10 text-[14px]"
                placeholder="Ex: Promotion Printemps 2025"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-black/80">
                Type de campagne *
              </Label>
              <Select value={type} onValueChange={(v: "EMAIL" | "SMS" | "NOTIFICATION") => setType(v)}>
                <SelectTrigger className="h-11 border-black/10 text-[14px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="NOTIFICATION">Notification Push</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-black/80">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] border-black/10 text-[14px]"
              placeholder="Description de la campagne"
            />
          </div>

          {/* Segment Selection */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-black/80">
              Segment cible
            </Label>
            <Select value={segmentId} onValueChange={setSegmentId}>
              <SelectTrigger className="h-11 border-black/10 text-[14px]">
                <SelectValue placeholder="Tous les clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les clients</SelectItem>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.nom} ({segment.nombreClients || 0} clients)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSegment && (
              <p className="text-[12px] text-black/60">
                Cette campagne sera envoyée à{" "}
                <strong>{selectedSegment.nombreClients || 0}</strong>{" "}
                destinataire(s)
              </p>
            )}
          </div>

          {/* Email Content */}
          {type === "EMAIL" && (
            <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Sujet de l'email *
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-11 border-black/10 text-[14px] bg-white"
                  placeholder="Ex: Découvrez nos nouveautés printemps"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Corps de l'email *
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] border-black/10 text-[14px] bg-white"
                  placeholder="Bonjour {prenom},&#10;&#10;Nous sommes ravis de vous présenter..."
                />
                <p className="text-[12px] text-black/60">
                  Variables disponibles: {"{nom}"}, {"{prenom}"}, {"{email}"}
                </p>
              </div>
            </div>
          )}

          {/* SMS Content */}
          {type === "SMS" && (
            <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Message SMS *
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[120px] border-black/10 text-[14px] bg-white"
                  placeholder="Bonjour {prenom}, découvrez nos offres..."
                  maxLength={160}
                />
                <div className="flex justify-between items-center">
                  <p className="text-[12px] text-black/60">
                    Variables: {"{nom}"}, {"{prenom}"}
                  </p>
                  <p className="text-[12px] text-black/60">
                    {body.length}/160 caractères
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Push Notification Content */}
          {type === "PUSH" && (
            <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Titre de la notification *
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-11 border-black/10 text-[14px] bg-white"
                  placeholder="Ex: Nouvelle offre disponible"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Message *
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[100px] border-black/10 text-[14px] bg-white"
                  placeholder="Découvrez nos nouveautés..."
                  maxLength={200}
                />
                <p className="text-[12px] text-black/60">
                  {body.length}/200 caractères
                </p>
              </div>
            </div>
          )}

          {/* Scheduling */}
          <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon
                className="h-5 w-5 text-black/60"
                strokeWidth={2}
              />
              <h3 className="text-[15px] font-medium text-black">
                Planification
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Date d'envoi
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-start text-left font-normal border-black/10 bg-white"
                    >
                      <CalendarIcon
                        className="mr-2 h-4 w-4 text-black/60"
                        strokeWidth={2}
                      />
                      {scheduledDate ? (
                        format(scheduledDate, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        <span className="text-black/40">
                          Sélectionner une date
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                  Heure d'envoi
                </Label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="h-11 border-black/10 text-[14px] bg-white"
                />
              </div>
            </div>

            {scheduledDate && (
              <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                <p className="text-[13px] text-blue-900">
                  <Clock
                    className="inline h-4 w-4 mr-1"
                    strokeWidth={2}
                  />
                  La campagne sera envoyée le{" "}
                  <strong>
                    {format(scheduledDate, "dd MMMM yyyy", { locale: fr })}
                  </strong>{" "}
                  à <strong>{scheduledTime}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-black/10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
          >
            Annuler
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={
                createCampaign.isPending || updateCampaign.isPending
              }
              className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
            >
              Sauvegarder en brouillon
            </Button>

            <PrimaryActionButton
              onClick={handleSchedule}
              disabled={
                createCampaign.isPending ||
                updateCampaign.isPending ||
                scheduleCampaign.isPending
              }
            >
              <Send className="h-4 w-4 mr-2" strokeWidth={2} />
              {scheduledDate ? "Planifier" : "Envoyer maintenant"}
            </PrimaryActionButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
