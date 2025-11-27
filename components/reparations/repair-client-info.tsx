"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetadataField } from "@/components/ui/metadata-field";
import { User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface RepairClientInfoProps {
  client: {
    id: string;
    nom: string;
    prenom?: string | null;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
  } | null;
  technicien?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  } | null;
}

export function RepairClientInfo({ client, technicien }: RepairClientInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Client Info */}
      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-black/60" strokeWidth={2} />
            Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {client ? (
            <>
              <MetadataField
                label="Nom"
                value={
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-[14px] text-black hover:underline"
                  >
                    {client.prenom
                      ? `${client.prenom} ${client.nom}`
                      : client.nom}
                  </Link>
                }
              />

              {client.email && (
                <MetadataField
                  label="Email"
                  value={client.email}
                  icon={Mail}
                  href={client.email}
                  linkType="mailto"
                />
              )}

              {client.telephone && (
                <MetadataField
                  label="Téléphone"
                  value={client.telephone}
                  icon={Phone}
                  href={client.telephone}
                  linkType="tel"
                />
              )}

              {client.adresse && (
                <MetadataField
                  label="Adresse"
                  value={client.adresse}
                  icon={MapPin}
                />
              )}
            </>
          ) : (
            <div className="text-[14px] text-black/40">
              Aucun client associé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technician Info */}
      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-black/60" strokeWidth={2} />
            Technicien assigné
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {technicien ? (
            <>
              <MetadataField
                label="Nom"
                value={`${technicien.prenom} ${technicien.nom}`}
              />

              <MetadataField
                label="Email"
                value={technicien.email}
                icon={Mail}
                href={technicien.email}
                linkType="mailto"
              />
            </>
          ) : (
            <div className="text-[14px] text-black/40">
              Aucun technicien assigné
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
