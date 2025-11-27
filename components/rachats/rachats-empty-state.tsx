import { IconBox } from "@/components/ui/icon-box";
import { RotateCcw } from "lucide-react";

export function RachatsEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <IconBox
                icon={RotateCcw}
                size="xl"
                shape="circle"
                bgColor="bg-black/5"
                iconColor="text-black/40"
            />
            <div className="text-center space-y-2">
                <h3 className="text-[16px] font-semibold text-black">
                    Aucun rachat enregistré
                </h3>
                <p className="text-[14px] text-black/60 max-w-md">
                    Commencez par enregistrer votre premier rachat d'article
                    d'occasion
                </p>
            </div>
        </div>
    );
}
