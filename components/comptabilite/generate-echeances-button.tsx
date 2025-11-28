"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGenerateEcheances } from "@/hooks/use-echeances";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export interface GenerateEcheancesButtonProps {
    missionId: string;
    missionNom: string;
    clientNom: string;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export function GenerateEcheancesButton({
    missionId,
    missionNom,
    clientNom,
    variant = "outline",
    size = "default",
}: GenerateEcheancesButtonProps) {
    const [open, setOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );
    const [result, setResult] = useState<{
        message: string;
        created: number;
    } | null>(null);

    const generateEcheances = useGenerateEcheances();
    const { toast } = useToast();

    const currentYear = new Date().getFullYear();
    const years = [
        currentYear - 1,
        currentYear,
        currentYear + 1,
        currentYear + 2,
    ];

    const handleGenerate = async () => {
        try {
            const response = await generateEcheances.mutateAsync({
                missionId,
                annee: parseInt(selectedYear),
            });
            setResult(response);

            if (response.created > 0) {
                toast({
                    title: "Échéances générées",
                    description: `${response.created} échéances ont été créées pour ${selectedYear}`,
                });
            }
        } catch (error: any) {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de générer les échéances",
                variant: "destructive",
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setResult(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size}>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Générer échéances
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[18px] font-semibold">
                        Générer les échéances fiscales
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/40">
                        Génération automatique des échéances fiscales et
                        sociales pour le dossier{" "}
                        <span className="font-medium text-black/60">
                            {clientNom}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {result ? (
                    <div className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center mb-3">
                                <CheckCircle2 className="h-6 w-6 text-black/60" />
                            </div>
                            <p className="text-[15px] font-medium text-black mb-1">
                                {result.created > 0
                                    ? `${result.created} échéances créées`
                                    : "Aucune nouvelle échéance"}
                            </p>
                            <p className="text-[13px] text-black/40">
                                {result.message}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[13px]">
                                Année de référence
                            </Label>
                            <Select
                                value={selectedYear}
                                onValueChange={setSelectedYear}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-3 rounded-lg bg-black/2 border border-black/5">
                            <p className="text-[12px] text-black/60">
                                Les échéances seront générées en fonction des
                                informations fiscales du client (régime TVA,
                                type d&apos;imposition, présence de salariés,
                                etc.)
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {result ? (
                        <Button
                            onClick={handleClose}
                            className="h-10 px-6 bg-black hover:bg-black/90"
                        >
                            Fermer
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="h-10"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={generateEcheances.isPending}
                                className="h-10 px-6 bg-black hover:bg-black/90"
                            >
                                {generateEcheances.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Générer"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
