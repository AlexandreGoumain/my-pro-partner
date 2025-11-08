import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import {
  BusinessTemplateService,
  BusinessType,
} from "@/lib/services/business-template.service";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST /api/business-templates/apply - Apply a business template
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { businessType } = await req.json();

    if (!businessType) {
      return NextResponse.json(
        { message: "Le type de business est requis" },
        { status: 400 }
      );
    }

    // Valider que le type de business est valide
    const validTypes = BusinessTemplateService.getAllTemplates().map(
      (t) => t.type
    );
    if (!validTypes.includes(businessType)) {
      return NextResponse.json(
        { message: "Type de business invalide" },
        { status: 400 }
      );
    }

    // Appliquer le template
    await BusinessTemplateService.applyTemplate(
      entrepriseId,
      businessType as BusinessType
    );

    const template = BusinessTemplateService.getTemplate(
      businessType as BusinessType
    );

    return NextResponse.json({
      success: true,
      message: `Template "${template.label}" appliqué avec succès`,
      template,
    });
  } catch (error) {
    console.error("[BUSINESS_TEMPLATES_APPLY_ERROR]", error);
    return handleTenantError(error);
  }
}
