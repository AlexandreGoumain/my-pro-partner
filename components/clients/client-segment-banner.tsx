import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";

export interface ClientSegmentBannerProps {
    segmentName: string;
    clientCount: number;
    onClearFilter: () => void;
}

export function ClientSegmentBanner({
    segmentName,
    clientCount,
    onClearFilter,
}: ClientSegmentBannerProps) {
    return (
        <Card className="border-black/20 shadow-sm bg-black/2">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center">
                            <Users
                                className="h-4 w-4 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-black">
                                Filtre actif : {segmentName}
                            </p>
                            <p className="text-[13px] text-black/60">
                                {clientCount} client
                                {clientCount > 1 ? "s" : ""} dans ce segment
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilter}
                        className="h-9 px-3 text-[13px] hover:bg-black/10"
                    >
                        <X className="h-4 w-4 mr-1.5" strokeWidth={2} />
                        Effacer le filtre
                    </Button>
                </div>
            </div>
        </Card>
    );
}
