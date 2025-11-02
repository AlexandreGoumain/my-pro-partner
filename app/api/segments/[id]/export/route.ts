import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// GET /api/segments/[id]/export - Export segment clients
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    // Get segment
    const segment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (segment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Get all clients for this entreprise
    const allClients = await prisma.client.findMany({
      where: { entrepriseId },
      orderBy: { createdAt: "desc" },
    });

    // Apply segment criteria
    const filteredClients = applySegmentCriteria(
      allClients,
      segment.criteres as any
    );

    // Format data based on requested format
    if (format === "json") {
      return NextResponse.json({
        segment: {
          id: segment.id,
          nom: segment.nom,
          description: segment.description,
        },
        clients: filteredClients,
        total: filteredClients.length,
        exportedAt: new Date().toISOString(),
      });
    }

    // CSV format
    const headers = [
      "ID",
      "Nom",
      "Prénom",
      "Email",
      "Téléphone",
      "Adresse",
      "Code Postal",
      "Ville",
      "Pays",
      "Points Fidélité",
      "Date de création",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredClients.map((client) =>
        [
          client.id,
          `"${client.nom}"`,
          `"${client.prenom || ""}"`,
          `"${client.email || ""}"`,
          `"${client.telephone || ""}"`,
          `"${client.adresse || ""}"`,
          `"${client.codePostal || ""}"`,
          `"${client.ville || ""}"`,
          `"${client.pays}"`,
          client.points_solde,
          client.createdAt.toISOString(),
        ].join(",")
      ),
    ];

    const csv = csvRows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="segment-${segment.nom.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
