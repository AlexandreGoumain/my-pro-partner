"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEmailSender } from "@/hooks/use-email-sender";
import { Segment } from "@/lib/types";
import { Mail, Send, Users } from "lucide-react";

interface BulkEmailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    segment: Segment | null;
    clientCount: number;
}

export function BulkEmailDialog({
    open,
    onOpenChange,
    segment,
    clientCount,
}: BulkEmailDialogProps) {
    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    const {
        subject,
        body,
        sending,
        setSubject,
        setBody,
        handleSubmit,
        resetForm,
    } = useEmailSender({
        recipientId: segment?.id || "",
        recipientType: "segment",
        recipientCount: clientCount,
        onSuccess: handleClose,
    });

    if (!segment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeaderSection
                    title="Envoyer un email groupé"
                    description={`Envoyez un email à tous les clients du segment "${segment.nom}"`}
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Recipient Info */}
                    <Card className="p-4 bg-black/2 border-black/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center">
                                    <Users
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        Destinataires
                                    </p>
                                    <p className="text-[13px] text-black/60">
                                        {clientCount} client
                                        {clientCount > 1 ? "s" : ""} dans ce
                                        segment
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/10 text-black/80 border-0 text-[13px]"
                            >
                                {clientCount}
                            </Badge>
                        </div>
                    </Card>

                    {/* Email Content */}
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="subject"
                                className="text-[14px] font-medium mb-2"
                            >
                                Sujet de l&apos;email *
                            </Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Objet de votre message..."
                                className="h-11 border-black/10 text-[14px]"
                                disabled={sending}
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="body"
                                className="text-[14px] font-medium mb-2"
                            >
                                Message *
                            </Label>
                            <Textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Rédigez votre message..."
                                className="min-h-[200px] border-black/10 text-[14px]"
                                disabled={sending}
                            />
                            <p className="text-[12px] text-black/40 mt-2">
                                Vous pouvez utiliser des variables : {"{nom}"},{" "}
                                {"{prenom}"}, {"{email}"}
                            </p>
                        </div>
                    </div>

                    {/* Warning */}
                    <Card className="p-4 border-black/20 bg-black/2">
                        <div className="flex items-start gap-3">
                            <Mail
                                className="h-5 w-5 text-black/60 mt-0.5"
                                strokeWidth={2}
                            />
                            <div>
                                <p className="text-[14px] font-medium text-black mb-1">
                                    Avant d&apos;envoyer
                                </p>
                                <p className="text-[13px] text-black/60">
                                    Assurez-vous que votre message est correct.
                                    L&apos;email sera envoyé à {clientCount}{" "}
                                    client{clientCount > 1 ? "s" : ""} et cette
                                    action ne pourra pas être annulée.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={sending}
                            className="h-11 px-5 text-[14px] border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <PrimaryActionButton
                            type="submit"
                            disabled={
                                sending || !subject.trim() || !body.trim()
                            }
                        >
                            {sending ? (
                                <>
                                    <Spinner className="w-4 h-4 mr-2" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send
                                        className="w-4 h-4 mr-2"
                                        strokeWidth={2}
                                    />
                                    Envoyer{" "}
                                    {clientCount > 0 && `(${clientCount})`}
                                </>
                            )}
                        </PrimaryActionButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
