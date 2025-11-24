import { BusinessSelector } from "@/components/landing/business-selector";
import { CompetitorComparison } from "@/components/landing/competitor-comparison";
import { CTASection } from "@/components/landing/cta-section";
import { FAQEnhanced } from "@/components/landing/faq-enhanced";
import { FeaturesShowcase } from "@/components/landing/features-showcase";
import { Footer } from "@/components/landing/footer";
import { HeroRedesigned } from "@/components/landing/hero-redesigned";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navigation } from "@/components/landing/navigation";
import { PricingCards } from "@/components/landing/pricing-cards";
import { ProblemsSolutions } from "@/components/landing/problems-solutions";
import { TrustBadgesEnhanced } from "@/components/landing/trust-badges-enhanced";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - ERP Simple et Intelligent pour votre Entreprise",
    description:
        "Gérez votre entreprise en quelques clics. Créez factures, analysez vos ventes, gérez vos stocks simplement. Réponses instantanées à toutes vos questions. Rejoignez notre liste d'attente.",
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
            "Plus de business. Moins de temps perdu. Gérez devis, factures, clients et stocks en quelques clics. Lancement imminent.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - ERP Simple et Intelligent",
        description:
            "Plus de business. Moins de temps perdu. Gérez votre entreprise en quelques clics. Lancement imminent.",
    },
};

export default function LandingPage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroRedesigned />
                <TrustBadgesEnhanced />
                <FeaturesShowcase />
                <BusinessSelector />
                <ProblemsSolutions />
                <HowItWorks />
                <CompetitorComparison />
                <PricingCards />
                <FAQEnhanced />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
