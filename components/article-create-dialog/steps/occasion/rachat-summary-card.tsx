import { Card, CardContent } from "@/components/ui/card";

interface RachatSummaryCardProps {
    rachat: {
        designation: string;
        description?: string;
    };
    categoryName?: string;
}

export function RachatSummaryCard({
    rachat,
    categoryName,
}: RachatSummaryCardProps) {
    return (
        <Card className="bg-black/2 border-black/10">
            <CardContent className="p-4 space-y-2">
                <div>
                    <p className="text-[12px] text-black/60">
                        Nom de l&apos;article
                    </p>
                    <p className="text-[14px] font-semibold text-black">
                        {rachat.designation}
                    </p>
                </div>
                {categoryName && (
                    <div>
                        <p className="text-[12px] text-black/60">Catégorie</p>
                        <p className="text-[14px] text-black">{categoryName}</p>
                    </div>
                )}
                {rachat.description && (
                    <div>
                        <p className="text-[12px] text-black/60">Description</p>
                        <p className="text-[13px] text-black">
                            {rachat.description}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
