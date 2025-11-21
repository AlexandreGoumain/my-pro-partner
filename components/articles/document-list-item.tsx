import { FileText } from "lucide-react";

export interface DocumentListItemProps {
    type: string;
    numero: string;
    client: string;
    montant: number;
    quantite: number;
    onClick?: () => void;
    className?: string;
}

export function DocumentListItem({
    type,
    numero,
    client,
    montant,
    quantite,
    onClick,
    className = "",
}: DocumentListItemProps) {
    return (
        <div
            className={`flex items-center justify-between p-3 border border-black/8 rounded-lg hover:bg-black/5 transition-all duration-200 ${
                onClick ? "cursor-pointer" : ""
            } ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-black/60" strokeWidth={2} />
                <div>
                    <p className="font-medium text-[14px] text-black">
                        {type} {numero}
                    </p>
                    <p className="text-[13px] text-black/60">{client}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-[14px] text-black">
                    {montant.toFixed(2)} €
                </p>
                <p className="text-[13px] text-black/60">x{quantite}</p>
            </div>
        </div>
    );
}
