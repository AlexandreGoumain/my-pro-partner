import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { CATEGORY_EXAMPLES } from "@/lib/constants/category-examples";
import { ChevronRight, Folder } from "lucide-react";

export interface CategoryExamplesProps {
    showExamples: boolean;
    onShowExamplesChange: (show: boolean) => void;
}

export function CategoryExamples({
    showExamples,
    onShowExamplesChange,
}: CategoryExamplesProps) {
    return (
        <Collapsible open={showExamples} onOpenChange={onShowExamplesChange}>
            <CollapsibleContent className="space-y-4">
                <Card className="border-purple-200 bg-purple-50/50 animate-in slide-in-from-top-5 duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Exemples d&apos;organisation
                        </CardTitle>
                        <CardDescription>
                            Inspirez-vous de ces exemples pour organiser votre catalogue
                            (catégories principales et sous-catégories)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {CATEGORY_EXAMPLES.map((example, idx) => (
                                <div key={idx} className="space-y-3">
                                    <p className="font-semibold text-sm">{example.title}</p>
                                    {example.categories.map((cat, catIdx) => (
                                        <div key={catIdx} className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Folder className="h-4 w-4 text-primary" />
                                                {cat.name}
                                            </div>
                                            <div className="ml-6 space-y-1">
                                                {cat.children.map((child, childIdx) => (
                                                    <div
                                                        key={childIdx}
                                                        className="flex items-center gap-2 text-xs text-muted-foreground"
                                                    >
                                                        <ChevronRight className="h-3 w-3" />
                                                        {child}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    );
}
