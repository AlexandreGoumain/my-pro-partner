"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Client } from "@/hooks/use-clients";
import { FilePlus, Phone, Send } from "lucide-react";

export interface ClientQuickActionsProps {
    client: Client;
    onSendEmail: () => void;
    onCall: () => void;
}

export function ClientQuickActions({
    client,
    onSendEmail,
    onCall,
}: ClientQuickActionsProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onSendEmail}
                        disabled={!client.email}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4 mr-2" strokeWidth={2} />
                        Envoyer un email
                    </Button>
                    <Button
                        onClick={onCall}
                        disabled={!client.telephone}
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Phone
                            className="h-4 w-4 mr-2 text-black/60"
                            strokeWidth={2}
                        />
                        <span className="text-black/80">Appeler</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        <FilePlus
                            className="h-4 w-4 mr-2 text-black/60"
                            strokeWidth={2}
                        />
                        <span className="text-black/80">Créer un devis</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
