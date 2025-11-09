"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Package, RefreshCw, Settings, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [wooConnected, setWooConnected] = useState(false);

  const handleShopifyConnect = () => {
    toast({
      title: "Shopify connecté",
      description: "Votre boutique Shopify est maintenant synchronisée",
    });
    setShopifyConnected(true);
  };

  const handleWooConnect = () => {
    toast({
      title: "WooCommerce connecté",
      description: "Votre boutique WooCommerce est maintenant synchronisée",
    });
    setWooConnected(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intégrations e-commerce</h1>
        <p className="text-muted-foreground mt-2">
          Connectez vos boutiques en ligne pour synchroniser produits et commandes
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intégrations actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(shopifyConnected ? 1 : 0) + (wooConnected ? 1 : 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {shopifyConnected || wooConnected ? "Il y a 5 min" : "Aucune"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shopifyConnected || wooConnected ? "127" : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intégrations disponibles */}
      <Tabs defaultValue="shopify" className="space-y-6">
        <TabsList>
          <TabsTrigger value="shopify" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Shopify
          </TabsTrigger>
          <TabsTrigger value="woocommerce" className="gap-2">
            <Package className="h-4 w-4" />
            WooCommerce
          </TabsTrigger>
        </TabsList>

        {/* Shopify */}
        <TabsContent value="shopify" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Shopify</CardTitle>
                    <CardDescription>
                      Synchronisez vos produits, commandes et stocks avec Shopify
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={shopifyConnected ? "default" : "secondary"}>
                  {shopifyConnected ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Connecté
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Non connecté
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopify-domain">Nom de domaine Shopify</Label>
                <Input
                  id="shopify-domain"
                  placeholder="votre-boutique.myshopify.com"
                  defaultValue={shopifyConnected ? "ma-boutique.myshopify.com" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopify-key">API Key</Label>
                <Input
                  id="shopify-key"
                  type="password"
                  placeholder="Votre clé API Shopify"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopify-secret">API Secret</Label>
                <Input
                  id="shopify-secret"
                  type="password"
                  placeholder="Votre secret API Shopify"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopify-token">Access Token</Label>
                <Input
                  id="shopify-token"
                  type="password"
                  placeholder="Votre token d'accès"
                />
              </div>

              <div className="flex gap-2">
                {shopifyConnected ? (
                  <>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Synchroniser maintenant
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShopifyConnected(false)}
                    >
                      Déconnecter
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleShopifyConnect} className="w-full">
                    Connecter Shopify
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WooCommerce */}
        <TabsContent value="woocommerce" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>WooCommerce</CardTitle>
                    <CardDescription>
                      Synchronisez vos produits, commandes et stocks avec WooCommerce
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={wooConnected ? "default" : "secondary"}>
                  {wooConnected ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Connecté
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Non connecté
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="woo-url">URL de la boutique</Label>
                <Input
                  id="woo-url"
                  placeholder="https://votre-boutique.com"
                  defaultValue={wooConnected ? "https://ma-boutique.com" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="woo-key">Consumer Key</Label>
                <Input
                  id="woo-key"
                  type="password"
                  placeholder="Votre Consumer Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="woo-secret">Consumer Secret</Label>
                <Input
                  id="woo-secret"
                  type="password"
                  placeholder="Votre Consumer Secret"
                />
              </div>

              <div className="flex gap-2">
                {wooConnected ? (
                  <>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Synchroniser maintenant
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setWooConnected(false)}
                    >
                      Déconnecter
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleWooConnect} className="w-full">
                    Connecter WooCommerce
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
