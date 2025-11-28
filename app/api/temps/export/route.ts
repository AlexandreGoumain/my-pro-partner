import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/temps/export - Export time entries as CSV
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const missionId = searchParams.get("missionId");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");
        const format = searchParams.get("format") || "csv";

        // Build where clause
        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (missionId) {
            where.missionId = missionId;
        }

        if (dateDebut || dateFin) {
            where.date = {};
            if (dateDebut) {
                where.date.gte = new Date(dateDebut);
            }
            if (dateFin) {
                where.date.lte = new Date(dateFin);
            }
        }

        // Fetch entries
        const entries = await prisma.entreeTemps.findMany({
            where,
            include: {
                mission: {
                    include: {
                        client: {
                            select: {
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "desc" },
        });

        if (format === "csv") {
            // Generate CSV
            const headers = [
                "Date",
                "Mission",
                "Client",
                "Description",
                "Collaborateur",
                "Durée (min)",
                "Durée (h)",
                "Facturable",
                "Taux horaire",
                "Montant HT",
                "Facturé",
            ];

            const rows = entries.map((entry) => {
                const dureeHeures = (entry.duree / 60).toFixed(2);
                const clientName = entry.mission?.client
                    ? `${entry.mission.client.nom}${entry.mission.client.prenom ? ` ${entry.mission.client.prenom}` : ""}`
                    : "";

                return [
                    new Date(entry.date).toLocaleDateString("fr-FR"),
                    entry.mission?.nom || "",
                    clientName,
                    `"${entry.description.replace(/"/g, '""')}"`,
                    entry.user?.name || entry.user?.email || "",
                    entry.duree.toString(),
                    dureeHeures,
                    entry.facturable ? "Oui" : "Non",
                    Number(entry.tauxHoraire).toFixed(2),
                    Number(entry.montant).toFixed(2),
                    entry.facturee ? "Oui" : "Non",
                ];
            });

            // Calculate totals
            const totalMinutes = entries.reduce((sum, e) => sum + e.duree, 0);
            const totalFacturable = entries
                .filter((e) => e.facturable)
                .reduce((sum, e) => sum + e.duree, 0);
            const totalMontant = entries
                .filter((e) => e.facturable)
                .reduce((sum, e) => sum + Number(e.montant), 0);

            // Add totals row
            rows.push([]);
            rows.push([
                "TOTAL",
                "",
                "",
                "",
                "",
                totalMinutes.toString(),
                (totalMinutes / 60).toFixed(2),
                "",
                "",
                totalMontant.toFixed(2),
                "",
            ]);
            rows.push([
                "Heures facturables",
                "",
                "",
                "",
                "",
                totalFacturable.toString(),
                (totalFacturable / 60).toFixed(2),
                "",
                "",
                "",
                "",
            ]);

            const csvContent = [
                headers.join(";"),
                ...rows.map((row) => row.join(";")),
            ].join("\n");

            // Add BOM for Excel UTF-8 compatibility
            const bom = "\uFEFF";
            const csvWithBom = bom + csvContent;

            return new NextResponse(csvWithBom, {
                headers: {
                    "Content-Type": "text/csv; charset=utf-8",
                    "Content-Disposition": `attachment; filename="timesheet_${new Date().toISOString().split("T")[0]}.csv"`,
                },
            });
        }

        // JSON format (for other uses)
        return NextResponse.json({
            entries: entries.map((e) => ({
                ...e,
                tauxHoraire: Number(e.tauxHoraire),
                montant: Number(e.montant),
            })),
            totals: {
                totalMinutes: entries.reduce((sum, e) => sum + e.duree, 0),
                totalFacturable: entries
                    .filter((e) => e.facturable)
                    .reduce((sum, e) => sum + e.duree, 0),
                totalMontant: entries
                    .filter((e) => e.facturable)
                    .reduce((sum, e) => sum + Number(e.montant), 0),
            },
        });
    } catch (error) {
        console.error("Error exporting time entries:", error);
        return NextResponse.json(
            { error: "Failed to export time entries" },
            { status: 500 }
        );
    }
}
