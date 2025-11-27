import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { AlertCircle, ArrowLeft } from "lucide-react";

export interface ClientDetailNotFoundProps {
    onBack: () => void;
}

export function ClientDetailNotFound({ onBack }: ClientDetailNotFoundProps) {
    return (
        <div className="space-y-6">
            <Card className="p-12 border-black/8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-5">
                    <IconBox
                        icon={AlertCircle}
                        size="2xl"
                        shape="circle"
                        bgColor="bg-black/5"
                        iconColor="text-black/40"
                    />
                    <div>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                            Client introuvable
                        </h3>
                        <p className="text-[14px] text-black/60 max-w-md">
                            Le client demandé n&apos;existe pas ou a été
                            supprimé.
                        </p>
                    </div>
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 mt-2"
                    >
                        <ArrowLeft
                            className="w-4 h-4 mr-2 text-black/60"
                            strokeWidth={2}
                        />
                        <span className="text-black/80">Retour à la liste</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
