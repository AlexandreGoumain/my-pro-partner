import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus, Loader2 } from "lucide-react";

export interface EmptySegmentStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    isLoading?: boolean;
}

export function EmptySegmentState({
    icon: Icon,
    title,
    description,
    buttonText,
    onButtonClick,
    isLoading = false,
}: EmptySegmentStateProps) {
    return (
        <Card className="p-12 border-dashed border-black/10 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-5">
                <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-black/40" strokeWidth={2} />
                </div>
                <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                        {title}
                    </h3>
                    <p className="text-[14px] text-black/60 max-w-md">
                        {description}
                    </p>
                </div>
                <Button
                    onClick={onButtonClick}
                    disabled={isLoading}
                    className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2
                                className="w-4 h-4 mr-2 animate-spin"
                                strokeWidth={2}
                            />
                            Création...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            {buttonText}
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
