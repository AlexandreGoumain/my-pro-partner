import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatusConfig {
    label: string;
    className: string;
    icon?: LucideIcon;
}

export interface StatusBadgeProps<T extends string> {
    /** Current status value */
    status: T;
    /** Configuration map for all statuses */
    config: Record<T, StatusConfig>;
    /** Default config if status not found */
    fallback?: StatusConfig;
    /** Additional className */
    className?: string;
    /** Badge size */
    size?: "sm" | "md";
}

/**
 * StatusBadge - Generic status badge component
 *
 * Creates a badge based on a status value and configuration map.
 *
 * @example
 * const STATUS_CONFIG = {
 *   ACTIVE: { label: "Actif", className: "bg-green-100 text-green-700" },
 *   INACTIVE: { label: "Inactif", className: "bg-gray-100 text-gray-600" },
 * } as const;
 *
 * <StatusBadge
 *   status="ACTIVE"
 *   config={STATUS_CONFIG}
 * />
 *
 * @example
 * // With icon
 * const CONFIG = {
 *   ONLINE: { label: "En ligne", className: "bg-green-100", icon: CheckCircle },
 * };
 *
 * <StatusBadge status="ONLINE" config={CONFIG} />
 */
export function StatusBadge<T extends string>({
    status,
    config,
    fallback = { label: status, className: "bg-black/5 text-black/60" },
    className,
    size = "md",
}: StatusBadgeProps<T>) {
    const statusConfig = config[status] || fallback;
    const Icon = statusConfig.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium border",
                size === "sm"
                    ? "text-[11px] px-2 py-0"
                    : "text-[12px] px-2.5 py-0.5",
                statusConfig.className,
                className
            )}
        >
            {Icon && (
                <Icon
                    className={cn(
                        "mr-1",
                        size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"
                    )}
                />
            )}
            {statusConfig.label}
        </Badge>
    );
}

/**
 * Helper to create a typed StatusBadge component
 *
 * @example
 * const RepairStatusBadge = createStatusBadge({
 *   DEPOSE: { label: "Déposé", className: "bg-black/5 text-black/60" },
 *   EN_COURS: { label: "En cours", className: "bg-black/90 text-white" },
 * });
 *
 * <RepairStatusBadge status="DEPOSE" />
 */
export function createStatusBadge<T extends string>(
    config: Record<T, StatusConfig>
) {
    return function ConfiguredStatusBadge({
        status,
        className,
        size,
    }: {
        status: T;
        className?: string;
        size?: "sm" | "md";
    }) {
        return (
            <StatusBadge
                status={status}
                config={config}
                className={className}
                size={size}
            />
        );
    };
}
