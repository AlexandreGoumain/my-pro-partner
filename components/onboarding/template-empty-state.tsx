import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function TemplateEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-black/20" />
        <p className="text-[14px] text-black/40">
          Sélectionnez un type d&apos;activité pour voir un aperçu de la
          configuration
        </p>
      </CardContent>
    </Card>
  );
}
