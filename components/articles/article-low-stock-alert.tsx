import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface ArticleLowStockAlertProps {
    stock: number;
    seuilAlerte: number;
    onCommand?: () => void;
}

export function ArticleLowStockAlert({
    stock,
    seuilAlerte,
    onCommand,
}: ArticleLowStockAlertProps) {
    return (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                        <p className="font-semibold text-amber-900 text-[14px]">
                            Alerte stock faible
                        </p>
                        <p className="text-[13px] text-amber-700 mt-1">
                            Le stock actuel ({stock} unités) est inférieur ou égal au
                            seuil d&apos;alerte ({seuilAlerte} unités). Pensez à
                            réapprovisionner.
                        </p>
                    </div>
                    {onCommand && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-amber-300 hover:bg-amber-100"
                            onClick={onCommand}
                        >
                            Commander
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
