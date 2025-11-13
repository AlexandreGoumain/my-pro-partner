import { BusinessTemplateCard } from "@/components/onboarding/business-template-card";
import { BusinessTemplatePreview } from "@/components/onboarding/business-template-preview";
import { TemplateEmptyState } from "@/components/onboarding/template-empty-state";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingInput } from "@/hooks/use-onboarding-page";
import { Building2 } from "lucide-react";

export interface OnboardingStepBusinessTypeProps {
  form: UseFormReturn<OnboardingInput>;
  templates: Record<string, BusinessTemplate[]>;
  isLoading: boolean;
  selectedTemplate: BusinessTemplate | null;
  onSelectTemplate: (template: BusinessTemplate) => void;
  className?: string;
}

export function OnboardingStepBusinessType({
  form,
  templates,
  isLoading,
  selectedTemplate,
  onSelectTemplate,
  className,
}: OnboardingStepBusinessTypeProps) {
  return (
    <div className={className}>
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
          Quel est votre type d&apos;activité ?
        </h2>
        <p className="text-[14px] text-black/40 mt-1">
          Nous allons configurer l&apos;application spécialement pour vous
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des templates */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(templates).map(([category, categoryTemplates]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-black/40" strokeWidth={2} />
                  <h3 className="text-[13px] font-semibold uppercase tracking-wide text-black/40">
                    {category}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {categoryTemplates.map((template) => (
                    <BusinessTemplateCard
                      key={template.type}
                      template={template}
                      isSelected={selectedTemplate?.type === template.type}
                      onSelect={() => {
                        onSelectTemplate(template);
                        form.setValue("businessType", template.type);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Aperçu du template */}
          <div className="lg:col-span-1">
            {selectedTemplate ? (
              <BusinessTemplatePreview template={selectedTemplate} />
            ) : (
              <TemplateEmptyState />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
