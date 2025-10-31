import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Package } from "lucide-react";
import { ArticleType, StepProps } from "../types";

export function TypeSelectionStep({ articleType, onTypeSelect }: StepProps) {
    return (
        <div className="space-y-3 py-4">
            <div className="text-center space-y-1.5">
                <h3 className="text-[28px] font-semibold text-black tracking-[-0.02em]">
                    Quel type d&apos;article souhaitez-vous créer ?
                </h3>
                <p className="text-[15px] text-black/60 max-w-md mx-auto">
                    Choisissez si vous vendez un produit physique ou un service
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border ${
                        articleType === "PRODUIT"
                            ? "border-black bg-black/2 shadow-sm"
                            : "border-black/10 hover:border-black/20"
                    }`}
                    onClick={() => onTypeSelect?.("PRODUIT")}
                >
                    <CardContent className="p-8 space-y-5">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                                <Package className="h-8 w-8 text-white" strokeWidth={2} />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                                Produit
                            </h4>
                            <p className="text-[14px] text-black/60 leading-relaxed">
                                Article physique avec gestion de stock
                            </p>
                        </div>
                        <div className="space-y-2.5 pt-1">
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Suivi du stock</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Alertes de réapprovisionnement</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Mouvements de stock</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border ${
                        articleType === "SERVICE"
                            ? "border-black bg-black/2 shadow-sm"
                            : "border-black/10 hover:border-black/20"
                    }`}
                    onClick={() => onTypeSelect?.("SERVICE")}
                >
                    <CardContent className="p-8 space-y-5">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                                <Briefcase className="h-8 w-8 text-white" strokeWidth={2} />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                                Service
                            </h4>
                            <p className="text-[14px] text-black/60 leading-relaxed">
                                Prestation ou service sans stock
                            </p>
                        </div>
                        <div className="space-y-2.5 pt-1">
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Pas de gestion de stock</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Facturation simplifiée</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-black/70">
                                <div className="w-1 h-1 rounded-full bg-black/40" />
                                <span>Tarification flexible</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
