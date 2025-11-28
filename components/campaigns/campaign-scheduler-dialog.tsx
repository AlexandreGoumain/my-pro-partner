"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Campaign } from "@/hooks/use-campaigns";
import { useCampaignSchedulerDialog } from "@/hooks/use-campaign-scheduler-dialog";
import { Send } from "lucide-react";
import { CampaignContentSection } from "./campaign-content-section";
import { CampaignScheduleSection } from "./campaign-schedule-section";

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
    const {
        form,
        formKey,
        updateField,
        segments,
        selectedSegment,
        isPending,
        isEditing,
        handleOpenChange,
        handleSaveDraft,
        handleSchedule,
    } = useCampaignSchedulerDialog({
        open,
        onOpenChange,
        campaign,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        {isEditing
                            ? "Modifier la campagne"
                            : "Nouvelle campagne"}
                    </DialogTitle>
                </DialogHeader>

                <div key={formKey} className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Nom de la campagne *
                            </Label>
                            <Input
                                value={form.nom}
                                onChange={(e) =>
                                    updateField("nom", e.target.value)
                                }
                                className="h-11 border-black/10 text-[14px]"
                                placeholder="Ex: Promotion Printemps 2025"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Type de campagne *
                            </Label>
                            <Select
                                value={form.type}
                                onValueChange={(
                                    v: "EMAIL" | "SMS" | "NOTIFICATION"
                                ) => updateField("type", v)}
                            >
                                <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMAIL">Email</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="NOTIFICATION">
                                        Notification Push
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Description
                        </Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
                            className="min-h-[60px] border-black/10 text-[14px]"
                            placeholder="Description de la campagne"
                        />
                    </div>

                    {/* Segment Selection */}
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-black/80">
                            Segment cible
                        </Label>
                        <Select
                            value={form.segmentId || "__all__"}
                            onValueChange={(val) =>
                                updateField(
                                    "segmentId",
                                    val === "__all__" ? "" : val
                                )
                            }
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                <SelectValue placeholder="Tous les clients" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">
                                    Tous les clients
                                </SelectItem>
                                {segments.map((segment) => (
                                    <SelectItem
                                        key={segment.id}
                                        value={segment.id}
                                    >
                                        {segment.nom} (
                                        {segment.nombreClients || 0} clients)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedSegment && (
                            <p className="text-[12px] text-black/60">
                                Cette campagne sera envoyée à{" "}
                                <strong>
                                    {selectedSegment.nombreClients || 0}
                                </strong>{" "}
                                destinataire(s)
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <CampaignContentSection
                        type={form.type}
                        subject={form.subject}
                        setSubject={(v) => updateField("subject", v)}
                        body={form.body}
                        setBody={(v) => updateField("body", v)}
                    />

                    {/* Scheduling */}
                    <CampaignScheduleSection
                        scheduledDate={form.scheduledDate}
                        setScheduledDate={(v) => updateField("scheduledDate", v)}
                        scheduledTime={form.scheduledTime}
                        setScheduledTime={(v) => updateField("scheduledTime", v)}
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-black/10">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
                    >
                        Annuler
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isPending}
                            className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
                        >
                            Sauvegarder en brouillon
                        </Button>

                        <PrimaryActionButton
                            onClick={handleSchedule}
                            disabled={isPending}
                        >
                            <Send className="h-4 w-4 mr-2" strokeWidth={2} />
                            {form.scheduledDate
                                ? "Planifier"
                                : "Envoyer maintenant"}
                        </PrimaryActionButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
