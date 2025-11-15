"use client";

import { Card } from "@/components/ui/card";
import type { Client } from "@/hooks/use-clients";
import { AlertCircle, Mail, Phone } from "lucide-react";

export interface ClientContactInfoProps {
    client: Client;
}

export function ClientContactInfo({ client }: ClientContactInfoProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                    Informations de contact
                </h3>
                <div className="space-y-4">
                    {client.email ? (
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Mail
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40">Email</p>
                                <p className="text-[14px] font-medium text-black">
                                    {client.email}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                            <AlertCircle className="h-4 w-4" strokeWidth={2} />
                            <span>Email non renseigné</span>
                        </div>
                    )}
                    {client.telephone ? (
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Phone
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40">Téléphone</p>
                                <p className="text-[14px] font-medium text-black">
                                    {client.telephone}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[13px] text-black/40 py-2">
                            <AlertCircle className="h-4 w-4" strokeWidth={2} />
                            <span>Téléphone non renseigné</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
