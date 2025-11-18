import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { TrustSignals } from "@/components/landing/trust-signals";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { Templates } from "@/components/landing/templates";
import { AIDemo } from "@/components/landing/ai-demo";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - ERP Simple et Intelligent pour votre Entreprise",
    description:
        "Gérez votre entreprise en quelques clics. Créez factures, analysez vos ventes, gérez vos stocks simplement. Réponses instantanées à toutes vos questions. Essai gratuit 14 jours sans carte bancaire.",
    keywords: [
        "ERP avec IA",
        "assistant IA entreprise",
        "ERP artisan",
        "logiciel gestion PME",
        "intelligence artificielle",
        "automatisation entreprise",
        "devis factures automatiques",
        "gestion stock",
        "gestion clients",
        "ERP français",
        "logiciel facturation",
        "gestion entreprise artisan",
        "comptabilité simplifiée",
        "CRM artisan",
    ],
    openGraph: {
        title: "MyProPartner - ERP Simple pour votre entreprise",
        description:
            "Plus de business. Moins de temps perdu. Gérez devis, factures, clients et stocks en quelques clics. 500+ entreprises nous font confiance. Essai gratuit 14 jours.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - ERP Simple et Intelligent",
        description:
            "Plus de business. Moins de temps perdu. Gérez votre entreprise en quelques clics. Essai gratuit 14 jours.",
    },
};

export default function LandingPage() {
    return (
        <>
            <ScrollReveal />
            <Navigation />
            <main className="min-h-screen">
                <Hero />
                <TrustSignals />
                <Stats />
                <Features />
                <Templates />
                <AIDemo />
                <Comparison />
                <Pricing />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </>
    );
}
