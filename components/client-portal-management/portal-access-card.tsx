import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, Unlock } from "lucide-react";
import { PortalEnableDialog } from "./portal-enable-dialog";
import { toast } from "sonner";

interface PortalAccessCardProps {
    client: {
        id: string;
        email?: string | null;
        clientPortalEnabled?: boolean;
        lastLoginAt?: Date | null;
    };
    onUpdate: () => void;
}

export function PortalAccessCard({ client, onUpdate }: PortalAccessCardProps) {
    const [enableDialogOpen, setEnableDialogOpen] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);

    const handleDisable = async () => {
        if (!confirm("Désactiver l'accès au portail client ?")) return;

        setIsDisabling(true);

        try {
            const res = await fetch(`/api/admin/clients/${client.id}/portal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enable: false,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Erreur lors de la désactivation");
                return;
            }

            toast.success(data.message);
            onUpdate();
        } catch (error) {
            toast.error("Erreur lors de la désactivation");
        } finally {
            setIsDisabling(false);
        }
    };

    return (
        <>
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Globe
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Portail Client
                                </h3>
                                <p className="text-[13px] text-black/40">
                                    Accès à l&apos;espace client
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className={`border-0 text-[11px] h-5 px-2 ${
                                client.clientPortalEnabled
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-black/60"
                            }`}
                        >
                            {client.clientPortalEnabled ? "Activé" : "Désactivé"}
                        </Badge>
                    </div>

                    {client.clientPortalEnabled ? (
                        <div className="space-y-3">
                            {client.lastLoginAt && (
                                <div className="rounded-lg bg-black/5 p-3">
                                    <p className="text-[13px] text-black/60">
                                        Dernière connexion :{" "}
                                        {new Date(client.lastLoginAt).toLocaleDateString(
                                            "fr-FR",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={handleDisable}
                                disabled={isDisabling}
                                className="w-full h-10 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <Lock className="h-4 w-4 mr-2 text-black/60" />
                                <span className="text-black/80">
                                    {isDisabling ? "Désactivation..." : "Désactiver l'accès"}
                                </span>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {!client.email && (
                                <div className="rounded-lg bg-black/5 p-3">
                                    <p className="text-[13px] text-black/60">
                                          Le client doit avoir une adresse email pour accéder
                                        au portail
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={() => setEnableDialogOpen(true)}
                                disabled={!client.email}
                                className="w-full h-10 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
                            >
                                <Unlock className="h-4 w-4 mr-2" />
                                Activer l'accès
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {client.email && (
                <PortalEnableDialog
                    open={enableDialogOpen}
                    onOpenChange={setEnableDialogOpen}
                    clientId={client.id}
                    clientEmail={client.email}
                    onSuccess={onUpdate}
                />
            )}
        </>
    );
}
