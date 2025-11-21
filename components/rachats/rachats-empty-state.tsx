import { RotateCcw } from "lucide-react";

export function RachatsEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-black/40" strokeWidth={2} />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-[16px] font-semibold text-black">
                    Aucun rachat enregistré
                </h3>
                <p className="text-[14px] text-black/60 max-w-md">
                    Commencez par enregistrer votre premier rachat d'article d'occasion
                </p>
            </div>
        </div>
    );
}
