import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/mandats - List mandats with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("mandats_immo");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const typeMandat = searchParams.get("typeMandat");
        const statut = searchParams.get("statut");
        const bienId = searchParams.get("bienId");
        const search = searchParams.get("search");
        const expiresSoon = searchParams.get("expiresSoon");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (typeMandat && typeMandat !== "ALL") {
            where.typeMandat = typeMandat;
        }

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        if (bienId) {
            where.bienId = bienId;
        }

        // Filter for mandats expiring in next 30 days
        if (expiresSoon === "true") {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            where.dateFin = {
                lte: thirtyDaysFromNow,
                gte: new Date(),
            };
            where.statut = "EN_COURS";
        }

        if (search) {
            where.OR = [
                { numero: { contains: search, mode: "insensitive" } },
                { bien: { titre: { contains: search, mode: "insensitive" } } },
                { mandant: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const mandats = await prisma.mandatImmobilier.findMany({
            where,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                        prixVente: true,
                        photos: true,
                    },
                },
                mandant: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        return NextResponse.json({ mandats });
    } catch (error) {
        console.error("Error fetching mandats:", error);
        return NextResponse.json(
            { error: "Failed to fetch mandats" },
            { status: 500 }
        );
    }
}

// POST /api/immobilier/mandats - Create new mandat
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("mandats_immo");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        // Validate required fields
        if (!body.bienId || !body.mandantId) {
            return NextResponse.json(
                { error: "Bien et mandant requis" },
                { status: 400 }
            );
        }

        // Generate numero
        const year = new Date().getFullYear();
        const lastMandat = await prisma.mandatImmobilier.findFirst({
            where: {
                entrepriseId: session.user.entrepriseId,
                numero: { startsWith: `M${year}` },
            },
            orderBy: { createdAt: "desc" },
            select: { numero: true },
        });

        let nextNumber = 1;
        if (lastMandat) {
            const match = lastMandat.numero.match(/M\d{4}-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const numero = `M${year}-${nextNumber.toString().padStart(4, "0")}`;

        // Calculate dateFin (default 12 months for exclusif, 3 for simple)
        const dateDebut = body.dateDebut ? new Date(body.dateDebut) : new Date();
        const dureeDefault = body.typeMandat?.includes("EXCLUSIF") ? 12 : 3;
        const duree = body.dureeMois || dureeDefault;
        const dateFin = new Date(dateDebut);
        dateFin.setMonth(dateFin.getMonth() + duree);

        const mandat = await prisma.mandatImmobilier.create({
            data: {
                numero,
                entrepriseId: session.user.entrepriseId,
                bienId: body.bienId,
                mandantId: body.mandantId,
                typeMandat: body.typeMandat || "VENTE_SIMPLE",
                statut: "EN_COURS",
                dateSignature: body.dateSignature ? new Date(body.dateSignature) : new Date(),
                dateDebut,
                dateFin,
                prixMandat: body.prixMandat,
                tauxHonoraires: body.tauxHonoraires || 5,
                honorairesHT: body.honorairesHT,
                honorairesTTC: body.honorairesTTC,
                chargeVendeur: body.chargeVendeur ?? true,
                agentId: body.agentId,
                notes: body.notes,
            },
            include: {
                bien: true,
                mandant: true,
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
        });

        // Update bien status
        await prisma.bienImmobilier.update({
            where: { id: body.bienId },
            data: { statut: "EN_ATTENTE" },
        });

        return NextResponse.json({ mandat }, { status: 201 });
    } catch (error) {
        console.error("Error creating mandat:", error);
        return NextResponse.json(
            { error: "Failed to create mandat" },
            { status: 500 }
        );
    }
}
