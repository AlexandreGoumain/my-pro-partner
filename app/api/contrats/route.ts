import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("contrats");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const statut = searchParams.get("statut");
        const type = searchParams.get("type");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        if (type && type !== "ALL") {
            where.typeContrat = type;
        }

        if (search) {
            where.OR = [
                { numero: { contains: search, mode: "insensitive" } },
                { nom: { contains: search, mode: "insensitive" } },
                { client: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const contrats = await prisma.contratEntretien.findMany({
            where,
            include: {
                client: {
                    select: {
                        nom: true,
                        prenom: true,
                        telephone: true,
                    },
                },
            },
            orderBy: {
                dateDebut: "desc",
            },
        });

        return NextResponse.json({ contrats });
    } catch (error) {
        console.error("Error fetching contrats:", error);
        return NextResponse.json(
            { error: "Failed to fetch contrats" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("contrats");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        // Get next numero
        const lastContrat = await prisma.contratEntretien.findFirst({
            where: { entrepriseId: session.user.entrepriseId },
            orderBy: { createdAt: "desc" },
            select: { numero: true },
        });

        let nextNumber = 1;
        if (lastContrat) {
            const match = lastContrat.numero.match(/CONT-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const numero = `CONT-${nextNumber.toString().padStart(3, "0")}`;

        const contrat = await prisma.contratEntretien.create({
            data: {
                numero,
                entrepriseId: session.user.entrepriseId,
                clientId: body.clientId,
                typeContrat: body.typeContrat,
                nom: body.nom,
                description: body.description,
                equipements: body.equipements,
                adresse: body.adresse,
                codePostal: body.codePostal,
                ville: body.ville,
                dateDebut: new Date(body.dateDebut),
                dateFin: new Date(body.dateFin),
                dureeAnnees: body.dureeAnnees || 1,
                montantHT: body.montantHT,
                montantTTC: body.montantTTC,
                periodicite: body.periodicite || "ANNUEL",
                nombreRevisionsAn: body.nombreRevisionsAn || 1,
                interventionsIncluses: body.interventionsIncluses || 0,
                tarifHoraire: body.tarifHoraire,
                remisePieces: body.remisePieces || 0,
                rappelAvantJours: body.rappelAvantJours || 30,
                renouvellementAuto: body.renouvellementAuto !== false,
                createdBy: session.user.id,
            },
            include: {
                client: true,
            },
        });

        return NextResponse.json({ contrat }, { status: 201 });
    } catch (error) {
        console.error("Error creating contrat:", error);
        return NextResponse.json(
            { error: "Failed to create contrat" },
            { status: 500 }
        );
    }
}
