import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { usePendingClients } from "@/hooks/use-pending-clients";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Mail, MapPin, Phone, XCircle } from "lucide-react";

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
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Clients en attente d&apos;approbation
                        </h3>
                    </div>
                    <div className="flex items-center justify-between ml-3">
                        <p className="text-[13px] text-black/40">
                            {count} demande{count > 1 ? "s" : ""} à traiter
                        </p>
                        <Badge className="bg-black text-white text-[12px] h-6 px-2.5 font-medium">
                            {count}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-3">
                    {clients.map((client) => (
                        <Card
                            key={client.id}
                            className="group/item relative overflow-hidden border-black/[0.08] bg-white hover:shadow-md hover:shadow-black/5 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.005] opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                            <div className="relative p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-black">
                                                {client.prenom
                                                    ? `${client.prenom} ${client.nom}`
                                                    : client.nom}
                                            </h4>
                                            <Badge
                                                variant="secondary"
                                                className="bg-black/5 text-black/60 text-[11px] h-5 px-2 font-medium"
                                            >
                                                En attente
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            {client.email && (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center justify-center h-6 w-6 rounded bg-black/5">
                                                        <Mail
                                                            className="h-3.5 w-3.5 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                    </div>
                                                    <p className="text-[13px] text-black/70">
                                                        {client.email}
                                                    </p>
                                                </div>
                                            )}
                                            {client.telephone && (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center justify-center h-6 w-6 rounded bg-black/5">
                                                        <Phone
                                                            className="h-3.5 w-3.5 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                    </div>
                                                    <p className="text-[13px] text-black/70">
                                                        {client.telephone}
                                                    </p>
                                                </div>
                                            )}
                                            {(client.ville ||
                                                client.adresse) && (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center justify-center h-6 w-6 rounded bg-black/5">
                                                        <MapPin
                                                            className="h-3.5 w-3.5 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                    </div>
                                                    <p className="text-[13px] text-black/70">
                                                        {client.ville &&
                                                        client.adresse
                                                            ? `${client.adresse}, ${client.ville}`
                                                            : client.ville ||
                                                              client.adresse}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[12px] text-black/40">
                                            Demande effectuée le{" "}
                                            {format(
                                                new Date(client.createdAt),
                                                "dd MMMM yyyy 'à' HH:mm",
                                                {
                                                    locale: fr,
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            onClick={() => approve(client.id)}
                                            size="sm"
                                            className="h-10 px-4 text-[13px] font-medium bg-black hover:bg-black/90 text-white transition-all duration-200"
                                        >
                                            <CheckCircle
                                                className="h-4 w-4 mr-1.5"
                                                strokeWidth={2}
                                            />
                                            Approuver
                                        </Button>
                                        <Button
                                            onClick={() => reject(client.id)}
                                            size="sm"
                                            variant="outline"
                                            className="h-10 px-4 text-[13px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                                        >
                                            <XCircle
                                                className="h-4 w-4 mr-1.5 text-black/60"
                                                strokeWidth={2}
                                            />
                                            <span className="text-black/80">
                                                Rejeter
                                            </span>
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
