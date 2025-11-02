export interface SegmentSectionHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function SegmentSectionHeader({
    title,
    description,
    action,
}: SegmentSectionHeaderProps) {
    return (
        <div className="mb-5 flex items-center justify-between">
            <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                    {title}
                </h3>
                <p className="text-[14px] text-black/40 mt-1">
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}
