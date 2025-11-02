import { BentoGrid } from "@/components/landing/bento-grid";
import { CTASection } from "@/components/landing/cta-section";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { Guarantees } from "@/components/landing/guarantees";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navigation } from "@/components/landing/navigation";
import { PricingCards } from "@/components/landing/pricing-cards";
import { StatsSection } from "@/components/landing/stats-section";
import { TrustBadges } from "@/components/landing/trust-badges";
import { ProblemsSolutions } from "@/components/landing/problems-solutions";
import { FeatureInvoicing } from "@/components/landing/feature-invoicing";
import { FeatureClients } from "@/components/landing/feature-clients";
import { FeatureInventory } from "@/components/landing/feature-inventory";
import { FeatureAnalytics } from "@/components/landing/feature-analytics";
import { BeforeAfter } from "@/components/landing/before-after";
import { SocialProofMetrics } from "@/components/landing/social-proof-metrics";
import { ROICalculator } from "@/components/landing/roi-calculator";
import { PricingComparison } from "@/components/landing/pricing-comparison";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - Gagnez 15h par semaine | ERP pour Artisans et PME",
    description:
        "L'ERP tout-en-un qui fait gagner 15h par semaine aux artisans et PME. Devis, factures, clients, stocks en 1 seul endroit. Essai gratuit 14 jours sans carte bancaire.",
    keywords: [
        "ERP artisan",
        "logiciel gestion PME",
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
        title: "MyProPartner - Gagnez 15h par semaine sur votre gestion",
        description:
            "L'ERP qui transforme la gestion de votre entreprise. 500+ artisans et PME nous font confiance. Essai gratuit 14 jours.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - ERP pour Artisans et PME",
        description:
            "Gagnez 15h par semaine avec l'ERP tout-en-un. Essai gratuit 14 jours.",
    },
};

export default function LandingPage() {
    return (
        <>
            <Navigation />
            <main>
                <Hero />
                <TrustBadges />
                <StatsSection />
                <ProblemsSolutions />
                <BentoGrid />
                <FeatureInvoicing />
                <FeatureClients />
                <FeatureInventory />
                <FeatureAnalytics />
                <BeforeAfter />
                <SocialProofMetrics />
                <HowItWorks />
                <Guarantees />
                <ROICalculator />
                <PricingCards />
                <PricingComparison />
                <FAQ />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
