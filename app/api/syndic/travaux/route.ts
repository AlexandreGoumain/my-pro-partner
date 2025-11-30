import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/travaux - List travaux
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_copro");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const statut = searchParams.get("statut");
        const categorie = searchParams.get("categorie");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error fetching travaux:", error);
        return NextResponse.json(
            { error: "Failed to fetch travaux" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/travaux - Create new travaux
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_copro");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId || !body.titre || !body.categorie) {
            return NextResponse.json(
                { error: "Copropriété, titre et catégorie requis" },
                { status: 400 }
            );
        }

        const travaux = await prisma.travauxCopropriete.create({
            data: {
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error creating travaux:", error);
        return NextResponse.json(
            { error: "Failed to create travaux" },
            { status: 500 }
        );
    }
}
