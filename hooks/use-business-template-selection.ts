"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BusinessTemplate } from "@/lib/services/business-template.service";

export function useBusinessTemplateSelection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<
    Record<string, BusinessTemplate[]>
  >({});
  const [selectedTemplate, setSelectedTemplate] =
    useState<BusinessTemplate | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Charger les templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business-templates");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des templates");
      }

      const data = await response.json();
      setTemplates(data.templates);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = async (
    templateType: string
  ): Promise<{ success: boolean }> => {
    try {
      setIsApplying(true);

      const response = await fetch("/api/business-templates/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessType: templateType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'application du template");
      }

      const data = await response.json();

      toast({
        title: "Template appliqué",
        description: data.message,
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsApplying(false);
    }
  };

  return {
    templates,
    isLoading,
    selectedTemplate,
    setSelectedTemplate,
    applyTemplate,
    isApplying,
  };
}
