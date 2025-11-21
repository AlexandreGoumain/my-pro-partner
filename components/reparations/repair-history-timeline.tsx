"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface RepairHistoryTimelineProps {
  historique: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: Date;
    createdBy: string;
  }>;
}

const actionLabels: Record<string, string> = {
  CREATED: "Créée",
  STATUS_CHANGED: "Statut modifié",
  ASSIGNED: "Assignée",
  DIAGNOSTIC_SUBMITTED: "Diagnostic soumis",
  PIECE_ADDED: "Pièce ajoutée",
  PIECE_REMOVED: "Pièce retirée",
  INTERVENTION_ADDED: "Intervention ajoutée",
  COMMENT_ADDED: "Commentaire ajouté",
  UPDATED: "Mise à jour",
};

export function RepairHistoryTimeline({
  historique,
}: RepairHistoryTimelineProps) {
  if (historique.length === 0) {
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
          Historique ({historique.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-black/10" />

          {historique.map((entry, index) => (
            <div key={entry.id} className="relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-black/20 bg-white" />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-medium text-black">
                    {actionLabels[entry.action] || entry.action}
                  </div>
                  <div className="text-[13px] text-black/40">
                    {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-[13px] text-black/60">
                  {entry.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
