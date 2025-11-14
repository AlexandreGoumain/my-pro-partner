"use client";

import { CardSection } from "@/components/ui/card-section";
import type { Client } from "@/hooks/use-clients";
import { AlertCircle, MapPin } from "lucide-react";

export interface ClientAddressInfoProps {
    client: Client;
}

export function ClientAddressInfo({ client }: ClientAddressInfoProps) {
    const hasAddress =
        client.adresse || client.ville || client.codePostal || client.pays;

    return (
        <CardSection padding="md">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                    Adresse
                </h3>
                {hasAddress ? (
                    <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <MapPin
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            {client.adresse && (
                                <p className="text-[14px] font-medium text-black">
                                    {client.adresse}
                                </p>
                            )}
                            {(client.codePostal || client.ville) && (
                                <p className="text-[14px] font-medium text-black">
                                    {client.codePostal} {client.ville}
                                </p>
                            )}
                            {client.pays && (
                                <p className="text-[13px] text-black/40 mt-1">
                                    {client.pays}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                        <AlertCircle className="h-4 w-4" strokeWidth={2} />
                        <span>Adresse non renseignée</span>
                    </div>
                )}
        </CardSection>
    );
}
