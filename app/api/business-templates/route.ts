import { BusinessTemplateService } from "@/lib/services/business-template.service";
import { NextResponse } from "next/server";

// ============================================
// GET /api/business-templates - Get all business templates
// ============================================

export async function GET() {
  try {
    const templatesByCategory =
      BusinessTemplateService.getTemplatesByCategory();

    return NextResponse.json({
      success: true,
      templates: templatesByCategory,
    });
  } catch (error) {
    console.error("[BUSINESS_TEMPLATES_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des templates" },
      { status: 500 }
    );
  }
}
