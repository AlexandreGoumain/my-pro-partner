"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Euro } from "lucide-react";

interface PriceInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
}

export function PriceInput({
    value,
    onChange,
    disabled = false,
    className,
}: PriceInputProps) {
    const [displayValue, setDisplayValue] = useState(value.toFixed(2));
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(value.toFixed(2));
        }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Supprimer tous les caractères non numériques sauf le point
        let cleaned = input.replace(/[^\d.]/g, "");

        // S'assurer qu'il n'y a qu'un seul point
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            cleaned = parts[0] + "." + parts.slice(1).join("");
        }

        // Limiter à 2 décimales
        if (parts.length === 2 && parts[1].length > 2) {
            cleaned = parts[0] + "." + parts[1].substring(0, 2);
        }

        // Limiter à 7 chiffres avant le point
        const beforeDecimal = cleaned.split(".")[0];
        if (beforeDecimal.length > 7) {
            return;
        }

        setDisplayValue(cleaned);

        // Convertir en nombre et appeler onChange
        const numValue = parseFloat(cleaned) || 0;
        onChange(numValue);
    };

    const handleFocus = () => {
        setIsFocused(true);
        // Sélectionner tout le texte au focus
        setTimeout(() => {
            inputRef.current?.select();
        }, 0);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Formater avec 2 décimales au blur
        const numValue = parseFloat(displayValue) || 0;
        setDisplayValue(numValue.toFixed(2));
        onChange(numValue);
    };

    // Affichage formaté pour le style
    const [units, cents] = displayValue.split(".");
    const formattedUnits = units || "0";
    const formattedCents = cents || "00";

    return (
        <div className={cn("relative", className)}>
            <div
                className={cn(
                    "flex items-center gap-3 px-4 h-14 rounded-lg border transition-all duration-200",
                    isFocused
                        ? "border-black/30 bg-white shadow-sm ring-2 ring-black/5"
                        : "border-black/10 bg-black/2 hover:border-black/20",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Icône € */}
                <Euro
                    className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isFocused ? "text-black" : "text-black/40"
                    )}
                    strokeWidth={2}
                />

                {/* Input caché mais fonctionnel */}
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder="0.00"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                />

                {/* Affichage stylisé */}
                <div
                    className="flex items-baseline gap-1 flex-1 cursor-text"
                    onClick={() => inputRef.current?.focus()}
                >
                    {/* Unités */}
                    <span
                        className={cn(
                            "text-[32px] font-semibold tracking-tight transition-colors",
                            isFocused ? "text-black" : "text-black/90"
                        )}
                    >
                        {formattedUnits}
                    </span>

                    {/* Point séparateur */}
                    <span
                        className={cn(
                            "text-[24px] font-semibold transition-colors",
                            isFocused ? "text-black/60" : "text-black/40"
                        )}
                    >
                        .
                    </span>

                    {/* Centimes */}
                    <span
                        className={cn(
                            "text-[24px] font-semibold transition-colors",
                            isFocused ? "text-black/80" : "text-black/60"
                        )}
                    >
                        {formattedCents}
                    </span>

                    {/* Symbole € */}
                    <span
                        className={cn(
                            "text-[20px] font-medium ml-2 transition-colors",
                            isFocused ? "text-black/70" : "text-black/50"
                        )}
                    >
                        €
                    </span>
                </div>

                {/* Indicateur de focus */}
                {isFocused && (
                    <div className="absolute inset-0 rounded-lg pointer-events-none">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full animate-pulse" />
                    </div>
                )}
            </div>

            {/* Hint text */}
            {isFocused && (
                <p className="text-[11px] text-black/50 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    Tapez le montant (ex: 99.99)
                </p>
            )}
        </div>
    );
}
