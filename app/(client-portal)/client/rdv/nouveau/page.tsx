"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientPrestations, type ClientPrestation } from "@/hooks/use-client-prestations";
import { useClientEmployes, type ClientEmploye } from "@/hooks/use-client-employes";
import { useClientDisponibilites, type TimeSlot } from "@/hooks/use-client-disponibilites";
import { useCreateRdv } from "@/hooks/use-client-rdv";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";

type BookingStep = "prestation" | "date" | "time" | "confirm" | "success";

interface BookingState {
    prestation: ClientPrestation | null;
    date: Date | null;
    heure: string | null;
    employe: { id: string; nom: string } | null;
    notes: string;
}

const STEPS: { key: BookingStep; label: string }[] = [
    { key: "prestation", label: "Prestation" },
    { key: "date", label: "Date" },
    { key: "time", label: "Horaire" },
    { key: "confirm", label: "Confirmation" },
];

export default function NouveauRdvPage() {
    const router = useRouter();
    const [step, setStep] = useState<BookingStep>("prestation");
    const [booking, setBooking] = useState<BookingState>({
        prestation: null,
        date: null,
        heure: null,
        employe: null,
        notes: "",
    });

    const { data: prestationsData, isLoading: loadingPrestations } = useClientPrestations();
    const { data: employes } = useClientEmployes();

    const { data: disponibilites, isLoading: loadingSlots } = useClientDisponibilites({
        date: booking.date ? format(booking.date, "yyyy-MM-dd") : "",
        prestationId: booking.prestation?.id || "",
        enabled: !!booking.date && !!booking.prestation,
    });

    const createRdv = useCreateRdv();

    // Generate next 14 days for date picker
    const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

    const handleSelectPrestation = (prestation: ClientPrestation) => {
        setBooking({ ...booking, prestation, date: null, heure: null, employe: null });
        setStep("date");
    };

    const handleSelectDate = (date: Date) => {
        setBooking({ ...booking, date, heure: null, employe: null });
        setStep("time");
    };

    const handleSelectTime = (slot: TimeSlot, employeId: string, employeNom: string) => {
        setBooking({
            ...booking,
            heure: slot.heure,
            employe: { id: employeId, nom: employeNom },
        });
        setStep("confirm");
    };

    const handleConfirm = async () => {
        if (!booking.prestation || !booking.date || !booking.heure) {
            toast.error("Informations manquantes");
            return;
        }

        try {
            await createRdv.mutateAsync({
                date: format(booking.date, "yyyy-MM-dd"),
                heure: booking.heure,
                prestationId: booking.prestation.id,
                employeId: booking.employe?.id,
                notes: booking.notes || undefined,
            });
            setStep("success");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la réservation"
            );
        }
    };

    const goBack = () => {
        if (step === "prestation") {
            router.push("/client/rdv");
        } else if (step === "date") {
            setStep("prestation");
        } else if (step === "time") {
            setStep("date");
        } else if (step === "confirm") {
            setStep("time");
        }
    };

    const currentStepIndex = STEPS.findIndex((s) => s.key === step);

    if (step === "success") {
        return (
            <div className="max-w-lg mx-auto text-center py-16">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                    Rendez-vous réservé !
                </h1>
                <p className="text-[14px] text-black/50 mb-8">
                    Votre demande a été envoyée. Vous recevrez une confirmation
                    dès que le professionnel aura validé votre rendez-vous.
                </p>
                <div className="bg-black/[0.02] rounded-lg p-4 text-left mb-8">
                    <div className="text-[13px] text-black/50 mb-1">Récapitulatif</div>
                    <div className="text-[15px] font-medium text-black">
                        {booking.prestation?.nom}
                    </div>
                    <div className="text-[14px] text-black/60 mt-1">
                        {booking.date && format(booking.date, "EEEE d MMMM yyyy", { locale: fr })}
                        {" à "}
                        {booking.heure}
                    </div>
                    {booking.employe && (
                        <div className="text-[13px] text-black/50 mt-1">
                            avec {booking.employe.nom}
                        </div>
                    )}
                </div>
                <Button
                    onClick={() => router.push("/client/rdv")}
                    className="bg-black hover:bg-black/90 text-white"
                >
                    Voir mes rendez-vous
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={goBack}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        Prendre rendez-vous
                    </h1>
                </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                    <div key={s.key} className="flex items-center">
                        <div
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all",
                                i < currentStepIndex
                                    ? "bg-black text-white"
                                    : i === currentStepIndex
                                    ? "bg-black/10 text-black"
                                    : "text-black/30"
                            )}
                        >
                            {i < currentStepIndex ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <span className="w-4 text-center">{i + 1}</span>
                            )}
                            <span className="hidden sm:inline">{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-black/20 mx-1" />
                        )}
                    </div>
                ))}
            </div>

            {/* Step content */}
            {step === "prestation" && (
                <div>
                    <h2 className="text-[16px] font-medium text-black mb-4">
                        Choisissez une prestation
                    </h2>
                    {loadingPrestations ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-20 bg-black/5 animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {prestationsData?.prestations.map((prestation) => (
                                <button
                                    key={prestation.id}
                                    onClick={() => handleSelectPrestation(prestation)}
                                    className="w-full text-left p-4 border border-black/8 rounded-lg hover:border-black/20 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[15px] font-medium text-black">
                                                {prestation.nom}
                                            </div>
                                            {prestation.description && (
                                                <div className="text-[13px] text-black/50 mt-0.5">
                                                    {prestation.description}
                                                </div>
                                            )}
                                            <div className="text-[13px] text-black/40 mt-1">
                                                {prestation.duree} min
                                            </div>
                                        </div>
                                        <div className="text-[15px] font-medium text-black">
                                            {prestation.prix}€
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {step === "date" && (
                <div>
                    <h2 className="text-[16px] font-medium text-black mb-4">
                        Choisissez une date
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableDates.map((date) => (
                            <button
                                key={date.toISOString()}
                                onClick={() => handleSelectDate(date)}
                                className={cn(
                                    "p-3 border rounded-lg text-center transition-all",
                                    booking.date?.toDateString() === date.toDateString()
                                        ? "border-black bg-black text-white"
                                        : "border-black/8 hover:border-black/20"
                                )}
                            >
                                <div className="text-[12px] text-current/60 capitalize">
                                    {format(date, "EEE", { locale: fr })}
                                </div>
                                <div className="text-[18px] font-medium">
                                    {format(date, "d")}
                                </div>
                                <div className="text-[12px] text-current/60 capitalize">
                                    {format(date, "MMM", { locale: fr })}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === "time" && (
                <div>
                    <h2 className="text-[16px] font-medium text-black mb-4">
                        Choisissez un horaire
                    </h2>
                    {loadingSlots ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-black/5 animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    ) : disponibilites?.slots && disponibilites.slots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {disponibilites.slots.map((slot) => (
                                <button
                                    key={slot.heure}
                                    onClick={() => {
                                        const emp = slot.employes[0];
                                        handleSelectTime(slot, emp.id, emp.nom);
                                    }}
                                    disabled={!slot.disponible}
                                    className={cn(
                                        "p-3 border rounded-lg text-center transition-all",
                                        slot.disponible
                                            ? "border-black/8 hover:border-black/20"
                                            : "border-black/5 bg-black/[0.02] text-black/30 cursor-not-allowed"
                                    )}
                                >
                                    <div className="text-[15px] font-medium">
                                        {slot.heure}
                                    </div>
                                    {slot.employes.length > 0 && (
                                        <div className="text-[11px] text-black/40 mt-0.5 truncate">
                                            {slot.employes[0].nom}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-[14px] text-black/50">
                                Aucun créneau disponible ce jour.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setStep("date")}
                                className="mt-4"
                            >
                                Choisir une autre date
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {step === "confirm" && (
                <div>
                    <h2 className="text-[16px] font-medium text-black mb-4">
                        Confirmez votre rendez-vous
                    </h2>

                    <div className="bg-black/[0.02] rounded-lg p-5 mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[13px] text-black/50">Prestation</span>
                                <span className="text-[14px] font-medium text-black">
                                    {booking.prestation?.nom}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[13px] text-black/50">Date</span>
                                <span className="text-[14px] text-black">
                                    {booking.date &&
                                        format(booking.date, "EEEE d MMMM yyyy", { locale: fr })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[13px] text-black/50">Heure</span>
                                <span className="text-[14px] text-black">{booking.heure}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[13px] text-black/50">Durée</span>
                                <span className="text-[14px] text-black">
                                    {booking.prestation?.duree} min
                                </span>
                            </div>
                            {booking.employe && (
                                <div className="flex justify-between">
                                    <span className="text-[13px] text-black/50">Avec</span>
                                    <span className="text-[14px] text-black">
                                        {booking.employe.nom}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-black/8 pt-3 flex justify-between">
                                <span className="text-[13px] text-black/50">Prix</span>
                                <span className="text-[16px] font-semibold text-black">
                                    {booking.prestation?.prix}€
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-[13px] text-black/60 mb-2 block">
                            Notes (optionnel)
                        </label>
                        <Textarea
                            value={booking.notes}
                            onChange={(e) =>
                                setBooking({ ...booking, notes: e.target.value })
                            }
                            placeholder="Informations complémentaires..."
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    <Button
                        onClick={handleConfirm}
                        disabled={createRdv.isPending}
                        className="w-full bg-black hover:bg-black/90 text-white h-11 text-[14px] font-medium"
                    >
                        {createRdv.isPending ? "Réservation en cours..." : "Confirmer le rendez-vous"}
                    </Button>
                </div>
            )}
        </div>
    );
}
