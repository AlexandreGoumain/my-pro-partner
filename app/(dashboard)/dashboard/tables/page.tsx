"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock } from "lucide-react";

export default function TablesPage() {
  const tables = [
    { id: 1, numero: 1, capacite: 2, statut: 'LIBRE', zone: 'Terrasse' },
    { id: 2, numero: 2, capacite: 4, statut: 'OCCUPEE', zone: 'Salle principale', client: 'Dupont', depuis: '18:30' },
    { id: 3, numero: 3, capacite: 6, statut: 'RESERVEE', zone: 'Salle principale', client: 'Martin', heure: '20:00' },
    { id: 4, numero: 4, capacite: 2, statut: 'LIBRE', zone: 'Terrasse' },
    { id: 5, numero: 5, capacite: 4, statut: 'LIBRE', zone: 'Salle principale' },
    { id: 6, numero: 6, capacite: 8, statut: 'OCCUPEE', zone: 'Salle VIP', client: 'Bernard', depuis: '19:15' },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'LIBRE': return 'bg-green-100 text-green-800 border-green-200';
      case 'OCCUPEE': return 'bg-red-100 text-red-800 border-red-200';
      case 'RESERVEE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des tables</h1>
          <p className="text-muted-foreground mt-2">
            Plan de salle et gestion des tables en temps réel
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une table
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tables.filter(t => t.statut === 'LIBRE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tables.filter(t => t.statut === 'OCCUPEE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tables.filter(t => t.statut === 'RESERVEE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan de salle */}
      <Card>
        <CardHeader>
          <CardTitle>Plan de salle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg transition-all ${getStatusColor(table.statut)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xl font-bold">Table {table.numero}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3" />
                    <span>{table.capacite}</span>
                  </div>
                </div>

                <div className="text-xs mb-2 opacity-80">{table.zone}</div>

                <div className="text-sm font-medium">{table.statut}</div>

                {table.client && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <div className="text-sm font-medium">{table.client}</div>
                    {table.depuis && (
                      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                        <Clock className="h-3 w-3" />
                        <span>Depuis {table.depuis}</span>
                      </div>
                    )}
                    {table.heure && (
                      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                        <Clock className="h-3 w-3" />
                        <span>À {table.heure}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
