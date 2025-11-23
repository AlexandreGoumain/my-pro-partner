"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, User, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { StatutReparation } from "@/lib/generated/prisma";

interface StatusChangeLog {
  oldStatut: StatutReparation;
  newStatut: StatutReparation;
  changedBy: string;
  changedAt: string;
  notes?: string;
}

interface HistoriqueEntry {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

interface RepairStatusTimelineProps {
  statusChangeLogs?: StatusChangeLog[];
  historique?: HistoriqueEntry[];
}

const STATUS_LABELS: Record<string, string> = {
  DEPOSE: "Déposé",
  DIAGNOSTIC: "Diagnostic",
  DEVIS_ENVOYE: "Devis envoyé",
  ATTENTE_PIECES: "Attente pièces",
  EN_COURS: "En cours",
  PRETE: "Prêt",
  LIVREE: "Livré",
  ANNULEE: "Annulé",
  ABANDONNEE: "Abandonné",
};

const ACTION_LABELS: Record<string, string> = {
  CREATED: "Créée",
  STATUS_CHANGE: "Statut modifié",
  ASSIGNED: "Assignée",
  DIAGNOSTIC_SUBMITTED: "Diagnostic soumis",
  PIECE_ADDED: "Pièce ajoutée",
  PIECE_REMOVED: "Pièce retirée",
  INTERVENTION_ADDED: "Intervention ajoutée",
  COMMENT_ADDED: "Commentaire ajouté",
  UPDATED: "Mise à jour",
};

// Statuses that trigger email notifications
const NOTIFICATION_STATUSES: StatutReparation[] = [
  "DEPOSE" as StatutReparation,
  "PRETE" as StatutReparation,
  "LIVREE" as StatutReparation,
];

type TimelineEntry = {
  id: string;
  type: "status" | "history";
  date: Date;
  title: string;
  description?: string;
  user?: string;
  hasNotification?: boolean;
};

export function RepairStatusTimeline({
  statusChangeLogs = [],
  historique = [],
}: RepairStatusTimelineProps) {
  // Combine and sort all timeline entries
  const allEntries: TimelineEntry[] = [
    // Status changes
    ...statusChangeLogs.map((log, index) => ({
      id: `status-${index}`,
      type: "status" as const,
      date: new Date(log.changedAt),
      title: `${STATUS_LABELS[log.oldStatut] || log.oldStatut} → ${STATUS_LABELS[log.newStatut] || log.newStatut}`,
      description: log.notes,
      user: log.changedBy,
      hasNotification: NOTIFICATION_STATUSES.includes(log.newStatut),
    })),
    // History entries
    ...historique.map((entry) => ({
      id: entry.id,
      type: "history" as const,
      date: new Date(entry.createdAt),
      title: ACTION_LABELS[entry.action] || entry.action,
      description: entry.description,
      user: entry.createdBy,
      hasNotification: false,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first

  if (allEntries.length === 0) {
    return (
      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-black/60" strokeWidth={2} />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[14px] text-black/40 text-center py-8">
            Aucun historique disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-black/60" strokeWidth={2} />
          Historique ({allEntries.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-black/10" />

          {allEntries.map((entry, index) => {
            const isStatusChange = entry.type === "status";
            const isFirst = index === 0;

            return (
              <div key={entry.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isStatusChange
                      ? "border-black bg-black text-white"
                      : "border-black/20 bg-white"
                  }`}
                >
                  {isStatusChange ? (
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-black/40" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className={`text-[14px] font-medium ${
                            isFirst ? "text-black" : "text-black/80"
                          }`}
                        >
                          {entry.title}
                        </div>
                        {entry.hasNotification && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-black/5 rounded-full">
                            <Mail className="h-3 w-3 text-black/60" strokeWidth={2} />
                            <span className="text-[11px] font-medium text-black/60">
                              Email envoyé
                            </span>
                          </div>
                        )}
                      </div>
                      {entry.description && (
                        <div className="text-[13px] text-black/60 leading-relaxed">
                          {entry.description}
                        </div>
                      )}
                      {entry.user && (
                        <div className="flex items-center gap-1.5 text-[12px] text-black/40">
                          <User className="h-3 w-3" strokeWidth={2} />
                          <span>Par {entry.user}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[13px] text-black/40 whitespace-nowrap">
                      {format(entry.date, "d MMM", { locale: fr })}
                      <br />
                      <span className="text-[12px]">
                        {format(entry.date, "HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
