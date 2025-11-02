"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, Users, Send } from "lucide-react";
import { toast } from "sonner";
import { Segment } from "@/lib/types";

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
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim()) {
            toast.error("Le sujet est requis");
            return;
        }

        if (!body.trim()) {
            toast.error("Le message est requis");
            return;
        }

        if (!segment) {
            toast.error("Aucun segment sélectionné");
            return;
        }

        setSending(true);

        try {
            // TODO: Implement actual email sending API
            // const response = await fetch(`/api/segments/${segment.id}/send-email`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ subject, body }),
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success(
                `Email envoyé avec succès à ${clientCount} client${clientCount > 1 ? "s" : ""}`
            );
            handleClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'envoi des emails";
            toast.error(errorMessage);
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setSubject("");
        setBody("");
        onOpenChange(false);
    };

    if (!segment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        Envoyer un email groupé
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Envoyez un email à tous les clients du segment "{segment.nom}"
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Recipient Info */}
                    <Card className="p-4 bg-black/2 border-black/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-black/60" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        Destinataires
                                    </p>
                                    <p className="text-[13px] text-black/60">
                                        {clientCount} client{clientCount > 1 ? "s" : ""} dans ce
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
                            <Label htmlFor="subject" className="text-[14px] font-medium mb-2">
                                Sujet de l'email *
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
                            <Label htmlFor="body" className="text-[14px] font-medium mb-2">
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
                                Vous pouvez utiliser des variables : {"{nom}"}, {"{prenom}"},{" "}
                                {"{email}"}
                            </p>
                        </div>
                    </div>

                    {/* Warning */}
                    <Card className="p-4 border-black/20 bg-black/2">
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-black/60 mt-0.5" strokeWidth={2} />
                            <div>
                                <p className="text-[14px] font-medium text-black mb-1">
                                    Avant d'envoyer
                                </p>
                                <p className="text-[13px] text-black/60">
                                    Assurez-vous que votre message est correct. L'email sera
                                    envoyé à {clientCount} client{clientCount > 1 ? "s" : ""} et
                                    cette action ne pourra pas être annulée.
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
                        <Button
                            type="submit"
                            disabled={sending || !subject.trim() || !body.trim()}
                            className="h-11 px-6 text-[14px] bg-black hover:bg-black/90 text-white"
                        >
                            {sending ? (
                                <>
                                    <Loader2
                                        className="w-4 h-4 mr-2 animate-spin"
                                        strokeWidth={2}
                                    />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Envoyer {clientCount > 0 && `(${clientCount})`}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
