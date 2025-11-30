import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/coproprietes - List condominiums
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("coproprietes");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");
        const ville = searchParams.get("ville");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (ville) {
            where.ville = { contains: ville, mode: "insensitive" };
        }

        if (search) {
            where.OR = [
                { nom: { contains: search, mode: "insensitive" } },
                { adresse: { contains: search, mode: "insensitive" } },
                { ville: { contains: search, mode: "insensitive" } },
            ];
        }

        const coproprietes = await prisma.copropriete.findMany({
            where,
            include: {
                _count: {
                    select: {
                        lots: true,
                        appelsCharges: true,
                        assemblees: true,
                        travauxCopro: true,
                    },
                },
            },
            orderBy: { nom: "asc" },
        });

        return NextResponse.json({ coproprietes });
    } catch (error) {
        console.error("Error fetching coproprietes:", error);
        return NextResponse.json(
            { error: "Failed to fetch coproprietes" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/coproprietes - Create new condominium
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("coproprietes");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.nom || !body.adresse || !body.codePostal || !body.ville) {
            return NextResponse.json(
                { error: "Nom, adresse, code postal et ville requis" },
                { status: 400 }
            );
        }

        // Generate reference
        const year = new Date().getFullYear();
        const lastCopro = await prisma.copropriete.findFirst({
            where: {
                entrepriseId: session.user.entrepriseId,
                reference: { startsWith: `COPRO-${year}` },
            },
            orderBy: { createdAt: "desc" },
            select: { reference: true },
        });

        let nextNumber = 1;
        if (lastCopro) {
            const match = lastCopro.reference.match(/COPRO-\d{4}-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const reference = `COPRO-${year}-${nextNumber.toString().padStart(3, "0")}`;

        const copropriete = await prisma.copropriete.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                reference,
                nom: body.nom,
                adresse: body.adresse,
                codePostal: body.codePostal,
                ville: body.ville,
                nbLots: body.nbLots || 1,
                nbBatiments: body.nbBatiments || 1,
                totalTantiemes: body.totalTantiemes || 10000,
                datePriseSyndic: body.datePriseSyndic
                    ? new Date(body.datePriseSyndic)
                    : new Date(),
                dateCreation: body.dateCreation
                    ? new Date(body.dateCreation)
                    : undefined,
                numeroImmatriculation: body.numeroImmatriculation,
                reglementCopro: body.reglementCopro,
                notes: body.notes,
            },
        });

        return NextResponse.json({ copropriete }, { status: 201 });
    } catch (error) {
        console.error("Error creating copropriete:", error);
        return NextResponse.json(
            { error: "Failed to create copropriete" },
            { status: 500 }
        );
    }
}
