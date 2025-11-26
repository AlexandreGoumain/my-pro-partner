import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/interventions - List interventions with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Allow both domicile (mobile work) and atelier (workshop) businesses
        const capabilityCheck = await requireAnyCapability("domicile", "atelier");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const statut = searchParams.get("statut");
        const priorite = searchParams.get("priorite");
        const type = searchParams.get("type");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        if (priorite && priorite !== "ALL") {
            where.priorite = priorite;
        }

        if (type && type !== "ALL") {
            where.typeIntervention = type;
        }

        if (search) {
            where.OR = [
                { numero: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { ville: { contains: search, mode: "insensitive" } },
                { client: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const interventions = await prisma.intervention.findMany({
            where,
            include: {
                client: {
                    select: {
                        nom: true,
                        prenom: true,
                        telephone: true,
                    },
                },
                plombier: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ priorite: "desc" }, { dateDemande: "desc" }],
            take: 100,
        });

        return NextResponse.json({ interventions });
    } catch (error) {
        console.error("Error fetching interventions:", error);
        return NextResponse.json(
            { error: "Failed to fetch interventions" },
            { status: 500 }
        );
    }
}

// POST /api/interventions - Create new intervention
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Allow both domicile (mobile work) and atelier (workshop) businesses
        const capabilityCheck = await requireAnyCapability("domicile", "atelier");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        let clientId = body.clientId;

        // If newClient is provided, create the client first
        if (body.newClient && !clientId) {
            const { nom, prenom, telephone } = body.newClient;

            if (!nom || !telephone) {
                return NextResponse.json(
                    { error: "Nom et téléphone requis pour un nouveau client" },
                    { status: 400 }
                );
            }

            // Create the new client
            const newClient = await prisma.client.create({
                data: {
                    entrepriseId: session.user.entrepriseId,
                    nom,
                    prenom: prenom || null,
                    telephone,
                    adresse: body.adresse,
                    codePostal: body.codePostal,
                    ville: body.ville,
                },
            });

            clientId = newClient.id;
        }

        if (!clientId) {
            return NextResponse.json(
                { error: "Client requis" },
                { status: 400 }
            );
        }

        // Get next numero
        const lastIntervention = await prisma.intervention.findFirst({
            where: { entrepriseId: session.user.entrepriseId },
            orderBy: { createdAt: "desc" },
            select: { numero: true },
        });

        let nextNumber = 1;
        if (lastIntervention) {
            const match = lastIntervention.numero.match(/INT-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        const numero = `INT-${nextNumber.toString().padStart(3, "0")}`;

        const intervention = await prisma.intervention.create({
            data: {
                numero,
                entrepriseId: session.user.entrepriseId,
                clientId,
                typeIntervention: body.typeIntervention,
                priorite: body.priorite || "NORMALE",
                description: body.description,
                adresse: body.adresse,
                codePostal: body.codePostal,
                ville: body.ville,
                complementAdresse: body.complementAdresse,
                latitude: body.latitude,
                longitude: body.longitude,
                equipement: body.equipement,
                marqueEquipement: body.marqueEquipement,
                modeleEquipement: body.modeleEquipement,
                anneeInstall: body.anneeInstall,
                datePrevisionnelle: body.datePrevisionnelle,
                plombierId: body.plombierId,
                camionnetteId: body.camionnetteId,
                statut: "DEMANDE",
                createdBy: session.user.id,
            },
            include: {
                client: true,
                plombier: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Create history log
        await prisma.interventionHistorique.create({
            data: {
                interventionId: intervention.id,
                action: "CREATE",
                description: `Intervention ${numero} créée`,
                createdBy: session.user.id,
            },
        });

        return NextResponse.json({ intervention }, { status: 201 });
    } catch (error) {
        console.error("Error creating intervention:", error);
        return NextResponse.json(
            { error: "Failed to create intervention" },
            { status: 500 }
        );
    }
}
