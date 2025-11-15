import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/lib/types/pos";
import { Banknote, Check, CreditCard } from "lucide-react";

export interface POSPaymentButtonsProps {
    onPayment: (method: PaymentMethod) => void;
    onTerminalPayment: () => void;
    processing: boolean;
}

export function POSPaymentButtons({
    onPayment,
    onTerminalPayment,
    processing,
}: POSPaymentButtonsProps) {
    return (
        <div className="space-y-2">
            <Button
                onClick={onTerminalPayment}
                disabled={processing}
                className="w-full h-12 bg-black hover:bg-black/90 text-white"
            >
                <CreditCard className="h-4 w-4 mr-2" />
                Payer par Terminal
            </Button>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={() => onPayment("ESPECES")}
                    disabled={processing}
                    variant="outline"
                    className="h-11 border-black/10 hover:bg-black/5"
                >
                    <Banknote className="h-4 w-4 mr-2" />
                    Espèces
                </Button>
                <Button
                    onClick={() => onPayment("CHEQUE")}
                    disabled={processing}
                    variant="outline"
                    className="h-11 border-black/10 hover:bg-black/5"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Chèque
                </Button>
            </div>
        </div>
    );
}
