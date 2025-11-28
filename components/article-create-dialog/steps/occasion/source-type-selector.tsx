import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart } from "lucide-react";

interface SourceTypeSelectorProps {
    sourceType: "rachat" | "nouveau";
    onChange: (type: "rachat" | "nouveau") => void;
}

export function SourceTypeSelector({
    sourceType,
    onChange,
}: SourceTypeSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Card
                className={`cursor-pointer border-2 transition-all ${
                    sourceType === "rachat"
                        ? "border-black bg-black/5"
                        : "border-black/10 hover:border-black/20"
                }`}
                onClick={() => onChange("rachat")}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <ShoppingCart
                            className={`h-5 w-5 mt-0.5 ${
                                sourceType === "rachat"
                                    ? "text-black"
                                    : "text-black/40"
                            }`}
                            strokeWidth={2}
                        />
                        <div>
                            <h4 className="text-[14px] font-semibold text-black">
                                Rachat existant
                            </h4>
                            <p className="text-[12px] text-black/60 mt-0.5">
                                Produit déjà racheté à un client
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card
                className={`cursor-pointer border-2 transition-all ${
                    sourceType === "nouveau"
                        ? "border-black bg-black/5"
                        : "border-black/10 hover:border-black/20"
                }`}
                onClick={() => onChange("nouveau")}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Package
                            className={`h-5 w-5 mt-0.5 ${
                                sourceType === "nouveau"
                                    ? "text-black"
                                    : "text-black/40"
                            }`}
                            strokeWidth={2}
                        />
                        <div>
                            <h4 className="text-[14px] font-semibold text-black">
                                Nouveau produit
                            </h4>
                            <p className="text-[12px] text-black/60 mt-0.5">
                                Produit en stock à mettre en vente
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
