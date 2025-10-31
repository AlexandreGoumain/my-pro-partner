"use client";

import { Check, Infinity, X } from "lucide-react";
import { useState } from "react";
import { UpgradeDialog } from "./upgrade-dialog";

interface Feature {
    text: string;
    available: boolean;
    detail: string;
}

interface FeatureCategory {
    category: string;
    items: Feature[];
}

interface FeaturesSectionProps {
    planName: string;
    planSlug: string;
    features: FeatureCategory[];
}

export function FeaturesSection({
    planName,
    planSlug,
    features,
}: FeaturesSectionProps) {
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState("");

    const handleUpgradeClick = (featureName: string) => {
        setSelectedFeature(featureName);
        setUpgradeDialogOpen(true);
    };

    return (
        <>
            <section className="py-20 px-6 sm:px-8">
                <div className="max-w-[1120px] mx-auto">
                    <div className="mb-16">
                        <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-black mb-4">
                            Fonctionnalités détaillées
                        </h2>
                        <p className="text-[17px] text-black/60">
                            Découvrez tout ce qui est inclus dans le plan{" "}
                            {planName}
                        </p>
                    </div>

                    <div className="space-y-12">
                        {features.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-[24px] font-semibold text-black mb-6 pb-3 border-b border-black/[0.08]">
                                    {category.category}
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {category.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                                                item.available
                                                    ? "bg-neutral-50 hover:bg-neutral-100"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {item.available ? (
                                                    <Check
                                                        className="w-5 h-5 text-black"
                                                        strokeWidth={2.5}
                                                    />
                                                ) : (
                                                    <X
                                                        className="w-5 h-5 text-black/20"
                                                        strokeWidth={2.5}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p
                                                    className={`text-[15px] font-medium ${
                                                        item.available
                                                            ? "text-black"
                                                            : "text-black/30 line-through"
                                                    }`}
                                                >
                                                    {item.text}
                                                    {item.text
                                                        .toLowerCase()
                                                        .includes("illimité") &&
                                                        item.available && (
                                                            <Infinity
                                                                className="inline-block w-4 h-4 ml-2 text-black/40"
                                                                strokeWidth={2}
                                                            />
                                                        )}
                                                </p>
                                                <p
                                                    className={`text-[13px] ${
                                                        item.available
                                                            ? "text-black/60"
                                                            : "text-black/20"
                                                    }`}
                                                >
                                                    {item.detail}
                                                </p>
                                            </div>
                                            {!item.available && (
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() =>
                                                            handleUpgradeClick(
                                                                item.text
                                                            )
                                                        }
                                                        className="text-[11px] font-semibold px-2 py-1 rounded bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors cursor-pointer"
                                                    >
                                                        Plan supérieur
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <UpgradeDialog
                open={upgradeDialogOpen}
                onOpenChange={setUpgradeDialogOpen}
                featureName={selectedFeature}
                currentPlan={planSlug}
            />
        </>
    );
}
