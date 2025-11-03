import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SettingsSectionProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
    className = "",
}: SettingsSectionProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                        <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                    </div>
                )}
                <div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-[14px] text-black/40 mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
