import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Badge } from "@/components/ui/badge";
import { usePendingClients } from "@/hooks/use-pending-clients";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { CheckCircle, XCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function PendingClientsSection() {
  const { clients, count, isLoading, approve, reject } = usePendingClients();

  if (isLoading) {
    return (
      <GridSkeleton
        itemCount={3}
        gridColumns={{ default: 1 }}
        gap={3}
        itemHeight="h-32"
      />
    );
  }

  if (count === 0) {
    return null;
  }

  return (
    <Card className="border-black/8 shadow-sm bg-black/2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center">
              <Clock className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black">
                Clients en attente d&apos;approbation
              </h3>
              <p className="text-[13px] text-black/60">
                {count} demande{count > 1 ? "s" : ""} à traiter
              </p>
            </div>
          </div>
          <Badge className="bg-black text-white text-[12px] h-6 px-2.5">
            {count}
          </Badge>
        </div>

        <div className="space-y-3">
          {clients.map((client) => (
            <Card key={client.id} className="border-black/8 shadow-sm bg-white">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                        {client.prenom
                          ? `${client.prenom} ${client.nom}`
                          : client.nom}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-black/5 text-black/60 text-[11px] h-5 px-2"
                      >
                        En attente
                      </Badge>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {client.email && (
                        <div className="flex items-center gap-2 text-[13px] text-black/60">
                          <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                          {client.email}
                        </div>
                      )}
                      {client.telephone && (
                        <div className="flex items-center gap-2 text-[13px] text-black/60">
                          <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                          {client.telephone}
                        </div>
                      )}
                      {(client.ville || client.adresse) && (
                        <div className="flex items-center gap-2 text-[13px] text-black/60">
                          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                          {client.ville && client.adresse
                            ? `${client.adresse}, ${client.ville}`
                            : client.ville || client.adresse}
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] text-black/40">
                      Demande effectuée le{" "}
                      {format(new Date(client.createdAt), "dd MMMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <PrimaryActionButton
                      onClick={() => approve(client.id)}
                      size="sm"
                      className="h-9 px-4 text-[13px]"
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" strokeWidth={2} />
                      Approuver
                    </PrimaryActionButton>
                    <Button
                      onClick={() => reject(client.id)}
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 text-[13px] font-medium border-black/10 hover:bg-black/5"
                    >
                      <XCircle className="h-4 w-4 mr-1.5 text-black/60" strokeWidth={2} />
                      <span className="text-black/80">Rejeter</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
