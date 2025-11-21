"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              <div>
                <div className="text-[13px] font-medium text-black/40 mb-1">
                  Nom
                </div>
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="text-[14px] text-black hover:underline"
                >
                  {client.prenom
                    ? `${client.prenom} ${client.nom}`
                    : client.nom}
                </Link>
              </div>

              {client.email && (
                <div>
                  <div className="text-[13px] font-medium text-black/40 mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-[14px] text-black hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              )}

              {client.telephone && (
                <div>
                  <div className="text-[13px] font-medium text-black/40 mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Téléphone
                  </div>
                  <a
                    href={`tel:${client.telephone}`}
                    className="text-[14px] text-black hover:underline"
                  >
                    {client.telephone}
                  </a>
                </div>
              )}

              {client.adresse && (
                <div>
                  <div className="text-[13px] font-medium text-black/40 mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Adresse
                  </div>
                  <div className="text-[14px] text-black">
                    {client.adresse}
                  </div>
                </div>
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
              <div>
                <div className="text-[13px] font-medium text-black/40 mb-1">
                  Nom
                </div>
                <div className="text-[14px] text-black">
                  {technicien.prenom} {technicien.nom}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-medium text-black/40 mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <a
                  href={`mailto:${technicien.email}`}
                  className="text-[14px] text-black hover:underline"
                >
                  {technicien.email}
                </a>
              </div>
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
