import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";

interface PortalEnableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    clientEmail: string;
    onSuccess: () => void;
}

export function PortalEnableDialog({
    open,
    onOpenChange,
    clientId,
    clientEmail,
    onSuccess,
}: PortalEnableDialogProps) {
    const [sendInvitation, setSendInvitation] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

    const handleEnable = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/clients/${clientId}/portal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enable: true,
                    sendInvitation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Erreur lors de l'activation");
                return;
            }

            if (data.temporaryPassword) {
                setTemporaryPassword(data.temporaryPassword);
            }

            toast.success(data.message);
            onSuccess();
        } catch (error) {
            toast.error("Erreur lors de l'activation");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPassword = () => {
        if (temporaryPassword) {
            navigator.clipboard.writeText(temporaryPassword);
            toast.success("Mot de passe copié !");
        }
    };

    const handleClose = () => {
        setTemporaryPassword(null);
        setSendInvitation(true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                {!temporaryPassword ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-[18px] font-semibold tracking-[-0.01em]">
                                Activer le portail client
                            </DialogTitle>
                            <DialogDescription className="text-[14px] text-black/60">
                                Donnez accès au portail client à{" "}
                                <span className="font-medium text-black">
                                    {clientEmail}
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="sendInvitation"
                                    checked={sendInvitation}
                                    onCheckedChange={(checked) =>
                                        setSendInvitation(checked as boolean)
                                    }
                                />
                                <Label
                                    htmlFor="sendInvitation"
                                    className="text-[14px] font-medium text-black cursor-pointer"
                                >
                                    <Mail className="h-4 w-4 inline mr-2 text-black/60" />
                                    Envoyer une invitation par email
                                </Label>
                            </div>

                            <div className="rounded-lg bg-black/5 p-4">
                                <p className="text-[13px] text-black/60">
                                    Un mot de passe temporaire sera généré automatiquement.
                                    Le client pourra le modifier après sa première connexion.
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="border-black/10 hover:bg-black/5"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleEnable}
                                disabled={isLoading}
                                className="bg-black hover:bg-black/90 text-white"
                            >
                                {isLoading ? "Activation..." : "Activer le portail"}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-[18px] font-semibold tracking-[-0.01em]">
                                Portail activé avec succès !
                            </DialogTitle>
                            <DialogDescription className="text-[14px] text-black/60">
                                Communiquez ces identifiants au client
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Email de connexion
                                </Label>
                                <Input
                                    value={clientEmail}
                                    readOnly
                                    className="border-black/10 bg-black/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Mot de passe temporaire
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={temporaryPassword}
                                        readOnly
                                        className="border-black/10 bg-black/5 font-mono"
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={handleCopyPassword}
                                        className="border-black/10 hover:bg-black/5"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-lg bg-black/5 p-4">
                                <p className="text-[13px] text-black/60">
                                      Copiez ce mot de passe maintenant. Il ne sera plus
                                    affiché après la fermeture de cette fenêtre.
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={handleClose}
                                className="bg-black hover:bg-black/90 text-white"
                            >
                                Fermer
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
