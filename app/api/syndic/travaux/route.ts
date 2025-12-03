import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/travaux
 * List travaux
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const statut = searchParams.get("statut");
            const categorie = searchParams.get("categorie");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (categorie) {
                where.categorie = categorie;
            }

            if (search) {
                where.OR = [
                    { titre: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { copropriete: { nom: { contains: search, mode: "insensitive" } } },
                ];
            }

            const travaux = await prisma.travauxCopropriete.findMany({
                where,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                            adresse: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json({ travaux });
        },
        {
            anyCapability: ["travaux_copro"],
            context: { resourceName: "TravauxCopropriete", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/travaux
 * Create new travaux
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId || !body.titre || !body.categorie) {
                throw new ValidationError("Copropriété, titre et catégorie requis");
            }

            const travaux = await prisma.travauxCopropriete.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    titre: body.titre,
                    description: body.description,
                    categorie: body.categorie,
                    statut: body.statut || "PROJET",
                    budgetEstime: body.budgetEstime,
                    budgetVote: body.budgetVote,
                    dateDebutPrevue: body.dateDebutPrevue ? new Date(body.dateDebutPrevue) : undefined,
                    dateFinPrevue: body.dateFinPrevue ? new Date(body.dateFinPrevue) : undefined,
                    notes: body.notes,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ travaux }, { status: 201 });
        },
        {
            anyCapability: ["travaux_copro"],
            context: { resourceName: "TravauxCopropriete", operation: "create" },
        }
    );
}
