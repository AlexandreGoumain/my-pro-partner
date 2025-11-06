"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { usePaymentSuccess } from "@/hooks/use-payment-success";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { isLoading } = usePaymentSuccess();

    return (
        <div className="min-h-screen bg-black/2 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 border-black/8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full h-20 w-20 bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
                    </div>

                    {isLoading ? (
                        <div>
                            <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                                Traitement du paiement...
                            </h1>
                            <p className="text-[14px] text-black/60">
                                Veuillez patienter pendant que nous confirmons votre paiement.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                                    Paiement réussi !
                                </h1>
                                <p className="text-[14px] text-black/60">
                                    Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu.
                                </p>
                            </div>

                            <div className="w-full pt-4">
                                <div className="bg-black/5 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-black/60">ID de session</span>
                                        <span className="font-medium text-black">{sessionId?.substring(0, 20)}...</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[12px] text-black/40">
                                Vous pouvez maintenant fermer cette fenêtre.
                            </p>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
