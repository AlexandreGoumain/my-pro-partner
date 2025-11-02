import { Badge } from "@/components/ui/badge";
import { FileText, Receipt, FileX } from "lucide-react";
import { cn } from "@/lib/utils";

export type DocumentType = "DEVIS" | "FACTURE" | "AVOIR";

export interface DocumentTypeBadgeProps {
    type: DocumentType;
    className?: string;
    showIcon?: boolean;
}

const typeConfig: Record<
    DocumentType,
    { label: string; icon: typeof FileText; className: string }
> = {
    DEVIS: {
        label: "Devis",
        icon: FileText,
        className: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    },
    FACTURE: {
        label: "Facture",
        icon: Receipt,
        className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    AVOIR: {
        label: "Avoir",
        icon: FileX,
        className: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    },
};

export function DocumentTypeBadge({
    type,
    className,
    showIcon = true,
}: DocumentTypeBadgeProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                "text-[12px] font-medium px-2.5 py-0.5 rounded-full gap-1",
                config.className,
                className
            )}
        >
            {showIcon && <Icon className="w-3 h-3" strokeWidth={2} />}
            {config.label}
        </Badge>
    );
}
