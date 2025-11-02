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
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - ERP Moderne pour Artisans et PME",
    description:
        "Gérez votre entreprise en toute simplicité. Clients, devis, factures, stocks : tout en un seul endroit. Essai gratuit 14 jours.",
    keywords: [
        "ERP",
        "artisan",
        "PME",
        "gestion entreprise",
        "devis",
        "factures",
        "stock",
        "comptabilité",
    ],
    openGraph: {
        title: "MyProPartner - ERP Moderne pour Artisans et PME",
        description:
            "Gérez votre entreprise en toute simplicité. Clients, devis, factures, stocks : tout en un seul endroit.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - ERP Moderne pour Artisans",
        description:
            "ERP tout-en-un pour artisans et PME. Essai gratuit 14 jours.",
    },
};

export default function LandingPage() {
    return (
        <>
            <Navigation />
            <main>
                <Hero />
                <StatsSection />
                <BentoGrid />
                <TrustBadges />
                <HowItWorks />
                <Guarantees />
                <PricingCards />
                <FAQ />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
