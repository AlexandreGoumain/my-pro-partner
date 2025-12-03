import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gestion-locative/baux
 * List leases with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const typeBail = searchParams.get("typeBail");
            const statut = searchParams.get("statut");
            const bienId = searchParams.get("bienId");
            const locataireId = searchParams.get("locataireId");
            const search = searchParams.get("search");
            const expiresSoon = searchParams.get("expiresSoon");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (typeBail && typeBail !== "ALL") {
                where.typeBail = typeBail;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (bienId) {
                where.bienId = bienId;
            }

            if (locataireId) {
                where.locataireId = locataireId;
            }

            // Filter for baux expiring in next 90 days
            if (expiresSoon === "true") {
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
                where.dateFin = {
                    lte: ninetyDaysFromNow,
                    gte: new Date(),
                };
                where.statut = "EN_COURS";
            }

            if (search) {
                where.OR = [
                    { reference: { contains: search, mode: "insensitive" } },
                    { bien: { titre: { contains: search, mode: "insensitive" } } },
                    { locatairePrincipal: { nom: { contains: search, mode: "insensitive" } } },
                ];
            }

            const baux = await prisma.bailLocatif.findMany({
                where,
                include: {
                    bien: {
                        select: {
                            id: true,
                            reference: true,
                            titre: true,
                            typeBien: true,
                            adresse: true,
                            ville: true,
                            photos: true,
                        },
                    },
                    locatairePrincipal: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                    proprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                    _count: {
                        select: {
                            loyers: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            });

            return NextResponse.json({ baux });
        },
        {
            anyCapability: ["baux_locatifs"],
            context: { resourceName: "BailLocatif", operation: "list" },
        }
    );
}

/**
 * POST /api/gestion-locative/baux
 * Create new lease
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bienId || !body.locataireId || !body.proprietaireId) {
                throw new ValidationError("Bien, locataire et propriétaire requis");
            }

            // Generate reference
            const year = new Date().getFullYear();
            const lastBail = await prisma.bailLocatif.findFirst({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    reference: { startsWith: `BAIL-${year}` },
                },
                orderBy: { createdAt: "desc" },
                select: { reference: true },
            });

            let nextNumber = 1;
            if (lastBail) {
                const match = lastBail.reference.match(/BAIL-\d{4}-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            const reference = `BAIL-${year}-${nextNumber.toString().padStart(4, "0")}`;

            const dateDebut = body.dateDebut ? new Date(body.dateDebut) : new Date();
            const dureeMois = body.dureeMois || (body.typeBail === "MEUBLE" ? 12 : 36);
            const dateFin = new Date(dateDebut);
            dateFin.setMonth(dateFin.getMonth() + dureeMois);

            const bail = await prisma.bailLocatif.create({
                data: {
                    reference,
                    entrepriseId: ctx.entrepriseId,
                    bienId: body.bienId,
                    locataireId: body.locataireId,
                    proprietaireId: body.proprietaireId,
                    typeBail: body.typeBail || "NU",
                    statut: "EN_COURS",
                    dateSignature: body.dateSignature ? new Date(body.dateSignature) : new Date(),
                    dateDebut,
                    dateFin,
                    dureeMois,
                    loyerHC: body.loyerHC,
                    provisions: body.provisions || body.charges || 0,
                    loyerCC: body.loyerHC + (body.provisions || body.charges || 0),
                    depotGarantie: body.depotGarantie,
                    indiceReference: body.indiceReference,
                    dateRevision: body.dateRevision ? new Date(body.dateRevision) : null,
                },
                include: {
                    bien: true,
                    locatairePrincipal: true,
                    proprietaire: true,
                },
            });

            // Update bien status
            await prisma.bienImmobilier.update({
                where: { id: body.bienId },
                data: { statut: "LOUE" },
            });

            return NextResponse.json({ bail }, { status: 201 });
        },
        {
            anyCapability: ["baux_locatifs"],
            context: { resourceName: "BailLocatif", operation: "create" },
        }
    );
}
