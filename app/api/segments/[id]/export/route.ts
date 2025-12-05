import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { applySegmentCriteria, SegmentCriteria } from "@/lib/types/segment";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================
// GET /api/segments/[id]/export - Export segment clients
// ============================================

export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const { searchParams } = new URL(req.url);
            const format = searchParams.get("format") || "csv";

            const segment = await prisma.segment.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!segment) {
                throw new NotFoundError("Segment non trouvé");
            }

            // Get all clients for this entreprise
            const allClients = await prisma.client.findMany({
                where: { entrepriseId: ctx.entrepriseId },
                orderBy: { createdAt: "desc" },
            });

            // Apply segment criteria
            const filteredClients = applySegmentCriteria(
                allClients,
                segment.criteres as unknown as SegmentCriteria
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
        },
        {
            context: { resourceName: "Segment", operation: "export" },
        }
    );
}
