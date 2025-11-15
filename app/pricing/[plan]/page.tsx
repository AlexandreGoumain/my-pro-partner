import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";
import { FeaturesSection } from "@/components/pricing/features-section";
import { PricingCTASection } from "@/components/pricing/pricing-cta-section";
import { PricingHero } from "@/components/pricing/pricing-hero";
import { PricingHighlightsCard } from "@/components/pricing/pricing-highlights-card";
import { PricingIdealForSection } from "@/components/pricing/pricing-ideal-for-section";
import { BackLink } from "@/components/ui/back-link";
import { pricingDetails } from "@/lib/constants/pricing-plans";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return [{ plan: "demarrage" }, { plan: "pro" }, { plan: "entreprise" }];
}

export default async function PricingDetailPage({
    params,
}: {
    params: Promise<{ plan: string }>;
}) {
    const { plan } = await params;
    const planData = pricingDetails[plan as keyof typeof pricingDetails];

    if (!planData) {
        notFound();
    }

    return (
        <>
            <Navigation />
            <main className="pt-16 min-h-screen bg-white">
                {/* Hero Section */}
                <section className="py-20 px-6 sm:px-8 bg-neutral-50 border-b border-black/[0.08]">
                    <div className="max-w-[1120px] mx-auto">
                        <BackLink
                            href="/#pricing"
                            label="Retour aux tarifs"
                            className="mb-8"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <PricingHero
                                planName={planData.name}
                                basePrice={planData.basePrice}
                                tagline={planData.tagline}
                                badge={planData.badge}
                            />

                            <PricingHighlightsCard
                                highlights={planData.highlights}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <FeaturesSection
                    planName={planData.name}
                    planSlug={plan}
                    features={planData.features}
                />

                {/* Ideal For Section */}
                <PricingIdealForSection ideal={planData.ideal} />

                {/* CTA Section */}
                <PricingCTASection />
            </main>
            <Footer />
        </>
    );
}
