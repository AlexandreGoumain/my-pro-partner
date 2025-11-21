import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { generateRachatReceiptHTML } from "@/lib/pdf/rachat-receipt";

// GET: Generate and download rachat receipt PDF
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { id } = await params;

    // Use verifyResourceAccess to check auth and ownership in one call
    const { resource: rachat } = await verifyResourceAccess(
      id,
      (id) => prisma.rachatArticle.findUnique({
        where: { id },
        include: {
          article: {
            include: {
              categorie: true,
            },
          },
          client: true,
          entreprise: {
            include: {
              parametres: true,
            },
          },
        },
      }),
      "Rachat"
    );

    // Get company info from parametres
    const companyInfo = {
      nom_entreprise: rachat.entreprise.parametres?.nom_entreprise || rachat.entreprise.nom,
      siret: rachat.entreprise.siret,
      adresse: rachat.entreprise.parametres?.adresse || null,
      code_postal: rachat.entreprise.parametres?.code_postal || null,
      ville: rachat.entreprise.parametres?.ville || null,
      telephone: rachat.entreprise.parametres?.telephone || null,
      email: rachat.entreprise.email,
      logo_url: rachat.entreprise.parametres?.logo_url || null,
    };

    // Generate HTML
    const html = generateRachatReceiptHTML(rachat as any, companyInfo);

    // For now, return HTML (PDF generation would require puppeteer)
    // In production, you'd use a service like puppeteer or a PDF API
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="rachat-${rachat.article.reference}.html"`,
      },
    });
  }, { resourceName: "Rachat PDF", operation: "generate" });
}
