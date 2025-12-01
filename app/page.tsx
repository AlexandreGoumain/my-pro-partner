import { BeforeAfter } from "@/components/landing/before-after";
import { BenefitsPremium } from "@/components/landing/benefits-premium";
import { BusinessTypes } from "@/components/landing/business-types";
import { ClientPortal } from "@/components/landing/client-portal";
import { FAQSimple } from "@/components/landing/faq-simple";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Guarantees } from "@/components/landing/guarantees";
import { HeroPremium } from "@/components/landing/hero-premium";
import { HowItWorksPremium } from "@/components/landing/how-it-works-premium";
import { Navigation } from "@/components/landing/navigation";
import { PricingCards } from "@/components/landing/pricing-cards";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { ROICalculator } from "@/components/landing/roi-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - L'IA qui gère votre entreprise",
    description:
        "Arrêtez de perdre 3h par jour en paperasse. L'assistant IA qui gère vos devis, factures et relances. Parlez, c'est fait.",
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
    ],
    openGraph: {
        title: "MyProPartner - L'IA qui gère votre entreprise",
        description:
            "Arrêtez de perdre 3h par jour en paperasse. L'assistant IA qui gère vos devis, factures et relances.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - L'IA qui gère votre entreprise",
        description:
            "Arrêtez de perdre 3h par jour en paperasse. L'assistant IA qui gère vos devis, factures et relances.",
    },
};

export default function LandingPage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroPremium />
                <BenefitsPremium />
                <BeforeAfter />
                <BusinessTypes />
                <ProductShowcase />
                <ClientPortal />
                <ROICalculator />
                <HowItWorksPremium />
                <Guarantees />
                <PricingCards />
                <FAQSimple />
                <FinalCTA />
            </main>
            <Footer />
        </>
    );
}
