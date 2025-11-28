"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FORME_JURIDIQUE,
    FORME_JURIDIQUE_LABELS,
    REGIME_FISCAL,
    REGIME_FISCAL_LABELS,
    REGIME_TVA,
    REGIME_TVA_LABELS,
    TYPE_IMPOSITION,
    TYPE_IMPOSITION_LABELS,
    type ClientInfoFiscale,
    type FormeJuridique,
    type RegimeFiscal,
    type RegimeTVA,
    type TypeImposition,
} from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { Calculator, ChevronDown, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export interface ClientFiscalFormProps {
    clientId: string;
    initialData?: ClientInfoFiscale;
    onSave: (data: ClientInfoFiscale) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

export function ClientFiscalForm({
    clientId: _clientId,
    initialData,
    onSave,
    isLoading: _isLoading = false,
    className,
}: ClientFiscalFormProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [siret, setSiret] = useState(initialData?.siret || "");
    const [formeJuridique, setFormeJuridique] = useState<FormeJuridique | "">(
        initialData?.formeJuridique || ""
    );
    const [regimeFiscal, setRegimeFiscal] = useState<RegimeFiscal | "">(
        initialData?.regimeFiscal || ""
    );
    const [regimeTVA, setRegimeTVA] = useState<RegimeTVA | "">(
        initialData?.regimeTVA || ""
    );
    const [typeImposition, setTypeImposition] = useState<TypeImposition | "">(
        initialData?.typeImposition || ""
    );
    const [dateClotureExercice, setDateClotureExercice] = useState(
        initialData?.dateClotureExercice || "12-31"
    );
    const [avecSalaries, setAvecSalaries] = useState(
        initialData?.avecSalaries || false
    );
    const [effectif, setEffectif] = useState(
        initialData?.effectif?.toString() || ""
    );
    const [codeAPE, setCodeAPE] = useState(initialData?.codeAPE || "");
    const [numTVAIntra, setNumTVAIntra] = useState(
        initialData?.numTVAIntra || ""
    );

    // Track changes using useMemo instead of useEffect
    const isDirty = useMemo(() => {
        return (
            siret !== (initialData?.siret || "") ||
            formeJuridique !== (initialData?.formeJuridique || "") ||
            regimeFiscal !== (initialData?.regimeFiscal || "") ||
            regimeTVA !== (initialData?.regimeTVA || "") ||
            typeImposition !== (initialData?.typeImposition || "") ||
            dateClotureExercice !==
                (initialData?.dateClotureExercice || "12-31") ||
            avecSalaries !== (initialData?.avecSalaries || false) ||
            effectif !== (initialData?.effectif?.toString() || "") ||
            codeAPE !== (initialData?.codeAPE || "") ||
            numTVAIntra !== (initialData?.numTVAIntra || "")
        );
    }, [
        siret,
        formeJuridique,
        regimeFiscal,
        regimeTVA,
        typeImposition,
        dateClotureExercice,
        avecSalaries,
        effectif,
        codeAPE,
        numTVAIntra,
        initialData,
    ]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                siret: siret || null,
                formeJuridique: formeJuridique || null,
                regimeFiscal: regimeFiscal || null,
                regimeTVA: regimeTVA || null,
                typeImposition: typeImposition || null,
                dateClotureExercice: dateClotureExercice || null,
                avecSalaries,
                effectif: effectif ? parseInt(effectif) : null,
                codeAPE: codeAPE || null,
                numTVAIntra: numTVAIntra || null,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Format SIRET (add spaces every 3 digits)
    const formatSiret = (value: string) => {
        const digits = value.replace(/\s/g, "");
        return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
    };

    const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
        setSiret(formatSiret(digits));
    };

    // Parse date clôture to month/day
    const [clotMonth, clotDay] = dateClotureExercice.split("-").map(Number);

    return (
        <Card className={cn("border-black/8", className)}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-black/2 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-black/5 flex items-center justify-center">
                                <Calculator className="h-4 w-4 text-black/60" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-[15px] font-medium text-black">
                                    Informations fiscales
                                </h3>
                                <p className="text-[12px] text-black/40">
                                    Régimes, forme juridique, dates
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 text-black/40 transition-transform",
                                isOpen && "rotate-180"
                            )}
                        />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-5 border-t border-black/5 pt-4">
                        {/* SIRET and APE */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="siret"
                                    className="text-[13px] text-black/60"
                                >
                                    SIRET
                                </Label>
                                <Input
                                    id="siret"
                                    value={siret}
                                    onChange={handleSiretChange}
                                    placeholder="123 456 789 01234"
                                    className="h-10 font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="codeAPE"
                                    className="text-[13px] text-black/60"
                                >
                                    Code APE/NAF
                                </Label>
                                <Input
                                    id="codeAPE"
                                    value={codeAPE}
                                    onChange={(e) => setCodeAPE(e.target.value)}
                                    placeholder="6920Z"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* Forme juridique and Type imposition */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Forme juridique
                                </Label>
                                <Select
                                    value={formeJuridique}
                                    onValueChange={(v) =>
                                        setFormeJuridique(v as FormeJuridique)
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FORME_JURIDIQUE.map((f) => (
                                            <SelectItem key={f} value={f}>
                                                {FORME_JURIDIQUE_LABELS[f]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Type d&apos;imposition
                                </Label>
                                <Select
                                    value={typeImposition}
                                    onValueChange={(v) =>
                                        setTypeImposition(v as TypeImposition)
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TYPE_IMPOSITION.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {TYPE_IMPOSITION_LABELS[t]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Régimes */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Régime fiscal
                                </Label>
                                <Select
                                    value={regimeFiscal}
                                    onValueChange={(v) =>
                                        setRegimeFiscal(v as RegimeFiscal)
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIME_FISCAL.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {REGIME_FISCAL_LABELS[r]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Régime TVA
                                </Label>
                                <Select
                                    value={regimeTVA}
                                    onValueChange={(v) =>
                                        setRegimeTVA(v as RegimeTVA)
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIME_TVA.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {REGIME_TVA_LABELS[r]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Date clôture and TVA */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] text-black/60">
                                    Date de clôture d&apos;exercice
                                </Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={clotDay?.toString() || "31"}
                                        onValueChange={(v) =>
                                            setDateClotureExercice(
                                                `${clotMonth?.toString().padStart(2, "0") || "12"}-${v.padStart(2, "0")}`
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 31 },
                                                (_, i) => i + 1
                                            ).map((d) => (
                                                <SelectItem
                                                    key={d}
                                                    value={d.toString()}
                                                >
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={clotMonth?.toString() || "12"}
                                        onValueChange={(v) =>
                                            setDateClotureExercice(
                                                `${v.padStart(2, "0")}-${clotDay?.toString().padStart(2, "0") || "31"}`
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10 flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                "Janvier",
                                                "Février",
                                                "Mars",
                                                "Avril",
                                                "Mai",
                                                "Juin",
                                                "Juillet",
                                                "Août",
                                                "Septembre",
                                                "Octobre",
                                                "Novembre",
                                                "Décembre",
                                            ].map((m, i) => (
                                                <SelectItem
                                                    key={i}
                                                    value={(i + 1).toString()}
                                                >
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="numTVAIntra"
                                    className="text-[13px] text-black/60"
                                >
                                    N° TVA Intracommunautaire
                                </Label>
                                <Input
                                    id="numTVAIntra"
                                    value={numTVAIntra}
                                    onChange={(e) =>
                                        setNumTVAIntra(e.target.value)
                                    }
                                    placeholder="FR12345678901"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* Salariés */}
                        <div className="flex items-start gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="avecSalaries"
                                    checked={avecSalaries}
                                    onCheckedChange={(checked) =>
                                        setAvecSalaries(checked as boolean)
                                    }
                                />
                                <Label
                                    htmlFor="avecSalaries"
                                    className="text-[13px] cursor-pointer"
                                >
                                    Avec salariés
                                </Label>
                            </div>
                            {avecSalaries && (
                                <div className="flex items-center gap-2">
                                    <Label className="text-[13px] text-black/60">
                                        Effectif :
                                    </Label>
                                    <Input
                                        type="number"
                                        value={effectif}
                                        onChange={(e) =>
                                            setEffectif(e.target.value)
                                        }
                                        className="h-9 w-20"
                                        min={1}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Save button */}
                        {isDirty && (
                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="h-10 px-6 bg-black hover:bg-black/90"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Enregistrer"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
