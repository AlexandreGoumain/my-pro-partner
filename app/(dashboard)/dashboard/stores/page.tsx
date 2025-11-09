"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, MapPin, Phone, Mail, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch("/api/stores");
      const data = await res.json();
      setStores(data.stores || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les magasins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Magasins</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos points de vente
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un magasin
        </Button>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun magasin</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre premier point de vente
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un magasin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{store.nom}</CardTitle>
                  </div>
                  {store.isMainStore && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
                <CardDescription className="font-mono text-xs">
                  {store.code}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {store.adresse && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{store.adresse}</div>
                      <div className="text-muted-foreground">
                        {store.codePostal} {store.ville}
                      </div>
                    </div>
                  </div>
                )}

                {store.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{store.telephone}</span>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{store.email}</span>
                  </div>
                )}

                <div className="pt-3 border-t flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {store.registers?.length || 0} caisse(s)
                  </span>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
