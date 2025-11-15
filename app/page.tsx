import { AIAssistant } from "@/components/landing/ai-assistant";
import { BentoGrid } from "@/components/landing/bento-grid";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navigation } from "@/components/landing/navigation";
import { PricingCards } from "@/components/landing/pricing-cards";
import { ProblemsSolutions } from "@/components/landing/problems-solutions";
import { TrustBadges } from "@/components/landing/trust-badges";
import { VideoDemo } from "@/components/landing/video-demo";
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
            <Navigation />
            <main>
                <Hero />
                <TrustBadges />
                <ProblemsSolutions />
                <AIAssistant />
                <VideoDemo />
                <BentoGrid />
                <HowItWorks />
                <PricingCards />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
