import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import {
    BusinessTemplateService,
    BusinessType,
} from "@/lib/services/business-template.service";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST /api/business-templates/apply - Apply a business template
// ============================================

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { businessType } = await req.json();

            if (!businessType) {
                throw new ValidationError("Le type de business est requis");
            }

            // Valider que le type de business est valide
            const validTypes = BusinessTemplateService.getAllTemplates().map(
                (t) => t.type
            );
            if (!validTypes.includes(businessType)) {
                throw new ValidationError("Type de business invalide");
            }

            // Appliquer le template
            await BusinessTemplateService.applyTemplate(
                ctx.entrepriseId,
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
        },
        {
            context: { resourceName: "BusinessTemplate", operation: "apply" },
        }
    );
}
