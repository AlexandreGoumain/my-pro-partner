"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export function StripeConfigError() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-amber-200 bg-amber-50/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600" strokeWidth={2} />
            </div>
            <CardTitle className="text-[22px] font-semibold text-black">
              Configuration Stripe requise
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-[15px] text-black/70 leading-relaxed">
            Les paiements ne sont pas encore configurés. Pour activer les abonnements, vous devez configurer vos produits et prix Stripe.
          </p>

          <div className="bg-white border border-black/10 rounded-lg p-5 space-y-4">
            <h3 className="text-[16px] font-semibold text-black flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-[12px] font-bold">
                1
              </span>
              Créer les produits dans Stripe
            </h3>
            <p className="text-[14px] text-black/60 ml-8">
              Rendez-vous sur votre dashboard Stripe et créez 3 produits (STARTER, PRO, ENTERPRISE) avec leurs prix mensuels et annuels.
            </p>
            <Button
              asChild
              className="ml-8 bg-[#635BFF] hover:bg-[#5851EA] text-white h-10 text-[14px]"
            >
              <a
                href="https://dashboard.stripe.com/test/products"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir Stripe Dashboard
                <ExternalLink className="w-4 h-4 ml-2" strokeWidth={2} />
              </a>
            </Button>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-5 space-y-4">
            <h3 className="text-[16px] font-semibold text-black flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-[12px] font-bold">
                2
              </span>
              Configurer les Price IDs
            </h3>
            <p className="text-[14px] text-black/60 ml-8">
              Copiez les Price IDs de chaque prix créé et ajoutez-les dans votre fichier <code className="px-1.5 py-0.5 bg-black/5 rounded text-[13px] font-mono">.env</code>
            </p>
            <div className="ml-8 bg-black/5 rounded-lg p-4 font-mono text-[13px] text-black/70 overflow-x-auto">
              <div className="space-y-1">
                <div>STRIPE_PRICE_STARTER_MONTHLY="price_..."</div>
                <div>STRIPE_PRICE_STARTER_ANNUAL="price_..."</div>
                <div>STRIPE_PRICE_PRO_MONTHLY="price_..."</div>
                <div>STRIPE_PRICE_PRO_ANNUAL="price_..."</div>
                <div>STRIPE_PRICE_ENTERPRISE_MONTHLY="price_..."</div>
                <div>STRIPE_PRICE_ENTERPRISE_ANNUAL="price_..."</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-5 space-y-4">
            <h3 className="text-[16px] font-semibold text-black flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-[12px] font-bold">
                3
              </span>
              Redémarrer le serveur
            </h3>
            <p className="text-[14px] text-black/60 ml-8">
              Après avoir modifié le fichier <code className="px-1.5 py-0.5 bg-black/5 rounded text-[13px] font-mono">.env</code>, redémarrez votre serveur de développement.
            </p>
            <div className="ml-8 bg-black/5 rounded-lg p-4 font-mono text-[13px] text-black/70">
              npm run dev
            </div>
          </div>

          <div className="border-t border-black/10 pt-6 mt-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-black/40" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-[14px] text-black/70">
                  Besoin d'aide ? Consultez le guide de configuration complet
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-10 text-[14px] border-black/10 hover:bg-black/5"
              >
                <Link href="/docs/STRIPE_SETUP.md" target="_blank">
                  Guide complet
                  <ExternalLink className="w-4 h-4 ml-2" strokeWidth={2} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[13px] text-blue-900">
              💡 <strong>Astuce :</strong> Utilisez le mode test de Stripe (clés commençant par <code className="px-1 bg-blue-100 rounded">sk_test_</code>) pour le développement. Vous pourrez basculer en mode production plus tard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
