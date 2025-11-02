import { cn } from "@/lib/utils";

export interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    {title}
                </h1>
                {description && (
                    <p className="text-[14px] text-black/40 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
        </div>
    );
}
