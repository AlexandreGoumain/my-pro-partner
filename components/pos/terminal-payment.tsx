"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    CheckCircle,
    XCircle,
    RefreshCw,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { toast } from "sonner";
import { Terminal, PaymentStatus } from "@/lib/types/pos";
import { CartItem } from "@/hooks/use-pos-cart";

export interface TerminalPaymentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    onSuccess: (documentId: string) => void;
    cartItems: CartItem[];
    clientId: string | null;
    remiseGlobale: number;
}

export function TerminalPayment({
  open,
  onOpenChange,
  amount,
  onSuccess,
  cartItems,
  clientId,
  remiseGlobale,
}: TerminalPaymentProps) {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  // Charger les terminaux
  useEffect(() => {
    if (open) {
      loadTerminals();
      setStatus("selecting");
    } else {
      // Reset
      setStatus("idle");
      setErrorMessage("");
      setPaymentIntentId("");
    }
  }, [open]);

  const loadTerminals = async () => {
    try {
      const res = await fetch("/api/terminal");
      const data = await res.json();
      const onlineTerminals = (data.terminals || []).filter(
        (t: Terminal) => t.status === "ONLINE"
      );
      setTerminals(onlineTerminals);

      // Sélectionner automatiquement s'il n'y en a qu'un
      if (onlineTerminals.length === 1) {
        setSelectedTerminalId(onlineTerminals[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des terminaux");
    }
  };

  const handlePayment = async () => {
    if (!selectedTerminalId) {
      toast.error("Veuillez sélectionner un terminal");
      return;
    }

    try {
      setStatus("creating_intent");
      setErrorMessage("");

      // 1. Créer le Payment Intent
      const intentRes = await fetch(`/api/terminal/${selectedTerminalId}/payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir en centimes
          currency: "eur",
          description: `Vente POS - ${cartItems.length} articles`,
        }),
      });

      const intentData = await intentRes.json();

      if (!intentRes.ok) {
        throw new Error(intentData.error || "Erreur lors de la création du paiement");
      }

      setPaymentIntentId(intentData.paymentIntent.id);
      setStatus("processing");

      // 2. Traiter le paiement sur le terminal
      const processRes = await fetch(`/api/terminal/${selectedTerminalId}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntent.id,
        }),
      });

      const processData = await processRes.json();

      if (!processRes.ok) {
        throw new Error(processData.error || "Erreur lors du traitement du paiement");
      }

      // 3. Enregistrer la vente dans le système
      const checkoutRes = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          clientId,
          remiseGlobale,
          paymentMethod: "CARTE",
          stripePaymentIntentId: intentData.paymentIntent.id,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || "Erreur lors de l'enregistrement de la vente");
      }

      setStatus("success");
      toast.success("Paiement réussi !");

      // Attendre 1.5s puis fermer et notifier le succès
      setTimeout(() => {
        onSuccess(checkoutData.document.id);
        onOpenChange(false);
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Une erreur est survenue");
      toast.error(error.message);
    }
  };

  const handleCancel = async () => {
    if (paymentIntentId && status === "processing") {
      try {
        await fetch(`/api/terminal/${selectedTerminalId}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        });
      } catch (error) {
        console.error("Erreur lors de l'annulation", error);
      }
    }
    onOpenChange(false);
  };

  const handleRetry = () => {
    setStatus("selecting");
    setErrorMessage("");
    setPaymentIntentId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement par Terminal
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un terminal et présentez la carte
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Montant */}
          <div className="bg-black/5 rounded-lg p-4 text-center">
            <div className="text-[13px] text-black/60 mb-1">Montant à payer</div>
            <div className="text-[32px] font-semibold text-black">
              {amount.toFixed(2)}€
            </div>
          </div>

          {/* Sélection du terminal */}
          {status === "selecting" && (
            <>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-black">
                  Terminal
                </label>
                <Select value={selectedTerminalId} onValueChange={setSelectedTerminalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un terminal" />
                  </SelectTrigger>
                  <SelectContent>
                    {terminals.length === 0 ? (
                      <div className="p-2 text-center text-[13px] text-black/40">
                        Aucun terminal en ligne
                      </div>
                    ) : (
                      terminals.map((terminal) => (
                        <SelectItem key={terminal.id} value={terminal.id}>
                          {terminal.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!selectedTerminalId || terminals.length === 0}
                  className="flex-1 bg-black hover:bg-black/90"
                >
                  Lancer le paiement
                </Button>
              </div>
            </>
          )}

          {/* Création du paiement */}
          {status === "creating_intent" && (
            <LoadingState
              spinnerSize={48}
              message="Initialisation du paiement..."
              minHeight="sm"
              className="py-8"
            />
          )}

          {/* En attente de la carte */}
          {status === "processing" && (
            <div className="text-center py-8">
              <div className="relative">
                <CreditCard className="h-16 w-16 text-black mx-auto mb-4 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="text-[16px] font-semibold text-black mb-2">
                En attente de la carte
              </p>
              <p className="text-[14px] text-black/60">
                Présentez la carte au terminal...
              </p>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="mt-6"
              >
                Annuler le paiement
              </Button>
            </div>
          )}

          {/* Succès */}
          {status === "success" && (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-[18px] font-semibold text-green-600 mb-2">
                Paiement réussi !
              </p>
              <p className="text-[14px] text-black/60">
                La transaction a été enregistrée
              </p>
            </div>
          )}

          {/* Erreur */}
          {status === "error" && (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-[18px] font-semibold text-red-600 mb-2">
                Paiement refusé
              </p>
              <p className="text-[14px] text-black/60 mb-6">
                {errorMessage}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-black hover:bg-black/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
