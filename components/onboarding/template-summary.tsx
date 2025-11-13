import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { BusinessTemplate } from "@/lib/services/business-template.service";

export interface TemplateSummaryProps {
  template: BusinessTemplate;
  className?: string;
}

export function TemplateSummary({ template, className }: TemplateSummaryProps) {
  return (
    <Alert className={className}>
      <Sparkles className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold text-[14px]">
            Configuration sélectionnée : {template.label}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-[12px]">
              {template.categories.length} catégories
            </Badge>
            {template.niveauxFidelite && (
              <Badge variant="secondary" className="text-[12px]">
                {template.niveauxFidelite.length} niveaux de fidélité
              </Badge>
            )}
            {template.seriesDocuments && (
              <Badge variant="secondary" className="text-[12px]">
                Numérotation automatique
              </Badge>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
