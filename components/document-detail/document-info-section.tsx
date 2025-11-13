import { format } from "date-fns";

export interface DocumentInfoSectionProps {
    dateEmission: Date | string;
    dateEcheance?: Date | string | null;
    validiteJours?: number;
    showValidite?: boolean;
}

/**
 * Reusable component for displaying document information (dates, validity)
 */
export function DocumentInfoSection({
    dateEmission,
    dateEcheance,
    validiteJours,
    showValidite = false,
}: DocumentInfoSectionProps) {
    return (
        <div>
            <h3 className="text-[14px] font-semibold text-black mb-3">
                Informations
            </h3>
            <div className="space-y-1 text-[14px]">
                <div className="flex justify-between">
                    <span className="text-black/60">Date d&apos;émission:</span>
                    <span className="font-medium">
                        {format(new Date(dateEmission), "dd/MM/yyyy")}
                    </span>
                </div>
                {dateEcheance && (
                    <div className="flex justify-between">
                        <span className="text-black/60">Date d&apos;échéance:</span>
                        <span className="font-medium">
                            {format(new Date(dateEcheance), "dd/MM/yyyy")}
                        </span>
                    </div>
                )}
                {showValidite && validiteJours !== undefined && (
                    <div className="flex justify-between">
                        <span className="text-black/60">Validité:</span>
                        <span className="font-medium">{validiteJours} jours</span>
                    </div>
                )}
            </div>
        </div>
    );
}
