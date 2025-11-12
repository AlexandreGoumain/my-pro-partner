import { GuideTip } from "@/hooks/use-first-time-guide";

export interface GuideContentProps {
    tip: GuideTip;
}

/**
 * Content section displaying the current tip
 */
export function GuideContent({ tip }: GuideContentProps) {
    return (
        <div className="space-y-3 mb-6">
            <h4 className="text-[16px] font-medium text-black">{tip.title}</h4>
            <p className="text-[14px] text-black/60 leading-relaxed">
                {tip.description}
            </p>
        </div>
    );
}
