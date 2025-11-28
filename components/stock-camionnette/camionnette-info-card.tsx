import { Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Camionnette {
    id: string;
    nom: string;
    immatriculation: string | null;
    marque: string | null;
    actif: boolean;
    plombierPrincipal: {
        name: string | null;
    } | null;
    _count: {
        stock: number;
    };
}

export interface CamionnetteInfoCardProps {
    camionnette: Camionnette;
    className?: string;
}

export function CamionnetteInfoCard({
    camionnette,
    className,
}: CamionnetteInfoCardProps) {
    return (
        <div
            className={cn(
                "p-5 rounded-xl bg-white border border-black/8 shadow-sm",
                className
            )}
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-black/60" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-black">
                        {camionnette.nom}
                    </h3>
                    <p className="text-[13px] text-black/60">
                        {camionnette.marque || "N/A"} -{" "}
                        {camionnette.immatriculation || "N/A"}
                    </p>
                </div>
                {camionnette.plombierPrincipal && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5">
                        <span className="text-[14px]">👤</span>
                        <span className="text-[13px] font-medium text-black">
                            {camionnette.plombierPrincipal.name}
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                    <Package className="w-4 h-4 text-blue-600" strokeWidth={2} />
                    <span className="text-[14px] font-semibold text-blue-600">
                        {camionnette._count.stock} articles
                    </span>
                </div>
            </div>
        </div>
    );
}
