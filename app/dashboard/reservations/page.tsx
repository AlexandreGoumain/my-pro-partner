"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Users, Phone, Mail, Clock } from "lucide-react";

export default function ReservationsPage() {
  const reservations = [
    { id: 1, client: 'Dupont Jean', date: '2025-11-10', heure: '19:00', personnes: 4, telephone: '06 12 34 56 78', statut: 'CONFIRMEE' },
    { id: 2, client: 'Martin Sophie', date: '2025-11-10', heure: '20:00', personnes: 2, telephone: '06 23 45 67 89', statut: 'EN_ATTENTE' },
    { id: 3, client: 'Bernard Paul', date: '2025-11-10', heure: '20:30', personnes: 6, telephone: '06 34 56 78 90', statut: 'CONFIRMEE' },
    { id: 4, client: 'Petit Marie', date: '2025-11-11', heure: '12:30', personnes: 3, telephone: '06 45 67 89 01', statut: 'CONFIRMEE' },
    { id: 5, client: 'Dubois Pierre', date: '2025-11-11', heure: '19:30', personnes: 8, telephone: '06 56 78 90 12', statut: 'EN_ATTENTE' },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Réservations</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos réservations de tables
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.statut === 'CONFIRMEE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reservations.filter(r => r.statut === 'EN_ATTENTE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couverts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.reduce((sum, r) => sum + r.personnes, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-lg">{reservation.client}</p>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(reservation.statut)}`}>
                      {getStatusLabel(reservation.statut)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{reservation.heure}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{reservation.personnes} personne(s)</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{reservation.telephone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {reservation.statut === 'EN_ATTENTE' && (
                    <Button variant="outline" size="sm">
                      Confirmer
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
