"use client";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEmailSender } from "@/hooks/use-email-sender";
import { Mail, User } from "lucide-react";

interface ClientEmailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        email?: string | null;
    } | null;
}

export function ClientEmailDialog({
    open,
    onOpenChange,
    client,
}: ClientEmailDialogProps) {
    const nomComplet = client
        ? [client.prenom, client.nom].filter(Boolean).join(" ") || "Client"
        : "Client";

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
        recipientId: client?.id || "",
        recipientType: "client",
        recipientName: nomComplet,
        recipientEmail: client?.email || "",
        onSuccess: handleClose,
    });

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeaderSection
                    title="Envoyer un email"
                    description={`Envoyez un email personnalisé à ${nomComplet}`}
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Recipient Info */}
                    <Card className="p-4 bg-black/2 border-black/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center">
                                    <User
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        {nomComplet}
                                    </p>
                                    <p className="text-[13px] text-black/60">
                                        {client.email}
                                    </p>
                                </div>
                            </div>
                            <Mail
                                className="h-5 w-5 text-black/40"
                                strokeWidth={2}
                            />
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

                    {/* Info */}
                    <Card className="p-4 border-black/20 bg-black/2">
                        <div className="flex items-start gap-3">
                            <Mail
                                className="h-5 w-5 text-black/60 mt-0.5"
                                strokeWidth={2}
                            />
                            <div>
                                <p className="text-[14px] font-medium text-black mb-1">
                                    Email personnalisé
                                </p>
                                <p className="text-[13px] text-black/60">
                                    L&apos;email sera envoyé au nom de votre
                                    entreprise. Le client pourra vous répondre
                                    directement.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <DialogActionButtons
                        onCancel={handleClose}
                        isLoading={sending}
                        disabled={!subject.trim() || !body.trim()}
                        submitLabel="Envoyer"
                        loadingLabel="Envoi en cours..."
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
