"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface RepairStatsCardsProps {
  stats: {
    totalReparations: number;
    enCours: number;
    pretes: number;
    enRetard: number;
  };
}

export function RepairStatsCards({ stats }: RepairStatsCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.totalReparations,
      icon: Wrench,
      description: "Réparations",
    },
    {
      title: "En cours",
      value: stats.enCours,
      icon: Clock,
      description: "En traitement",
    },
    {
      title: "Prêtes",
      value: stats.pretes,
      icon: CheckCircle2,
      description: "À récupérer",
    },
    {
      title: "En retard",
      value: stats.enRetard,
      icon: AlertCircle,
      description: "Dépassé le délai",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="border-black/10 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] text-black/60 font-medium">
                    {card.title}
                  </p>
                  <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                    {card.value}
                  </p>
                  <p className="text-[12px] text-black/40">
                    {card.description}
                  </p>
                </div>
                <div className="p-3 bg-black/5 rounded-lg">
                  <Icon className="h-5 w-5 text-black/40" strokeWidth={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
