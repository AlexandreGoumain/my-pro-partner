import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export interface ClientDetailNotFoundProps {
    onBack: () => void;
}

export function ClientDetailNotFound({ onBack }: ClientDetailNotFoundProps) {
    return (
        <div className="space-y-6">
            <Card className="p-12 border-black/8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-5">
                    <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                        <AlertCircle
                            className="w-10 h-10 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                            Client introuvable
                        </h3>
                        <p className="text-[14px] text-black/60 max-w-md">
                            Le client demandé n'existe pas ou a été supprimé.
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
