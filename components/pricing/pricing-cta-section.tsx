import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingCTASection() {
    return (
        <section className="py-20 px-6 sm:px-8">
            <div className="max-w-[800px] mx-auto text-center space-y-6">
                <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-black">
                    Prêt à commencer ?
                </h2>
                <p className="text-[17px] text-black/60">
                    Essayez gratuitement pendant 14 jours, sans carte bancaire.
                </p>
                <div className="pt-4">
                    <Link href="/auth/register">
                        <Button
                            size="lg"
                            className="bg-black hover:bg-black/90 text-white rounded-full h-12 px-8 text-[14px] font-semibold"
                        >
                            Commencer l&apos;essai gratuit
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
