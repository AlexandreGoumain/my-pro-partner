import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { AffaireCreateInput } from "@/lib/types/juridique";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/affaires - List affaires with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check capability for juridique business
        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const statut = searchParams.get("statut");
        const domaine = searchParams.get("domaine");
        const juridiction = searchParams.get("juridiction");
        const clientId = searchParams.get("clientId");
        const responsableId = searchParams.get("responsableId");
        const search = searchParams.get("search");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: Prisma.AffaireWhereInput = {
            entrepriseId: session.user.entrepriseId,
        };

        if (statut && statut !== "ALL") {
            // Support multiple statuses (comma-separated)
            const statuts = statut.split(",");
            if (statuts.length === 1) {
                where.statut = statut as any;
            } else {
                where.statut = { in: statuts as any };
            }
        }

        if (domaine && domaine !== "ALL") {
            const domaines = domaine.split(",");
            if (domaines.length === 1) {
                where.domaine = domaine as any;
            } else {
                where.domaine = { in: domaines as any };
            }
        }

        if (juridiction && juridiction !== "ALL") {
            where.juridiction = juridiction as any;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (responsableId) {
            where.responsableId = responsableId;
        }

        if (search) {
            where.OR = [
                { reference: { contains: search, mode: "insensitive" } },
                { intitule: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { numeroRG: { contains: search, mode: "insensitive" } },
                { client: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const affaires = await prisma.affaire.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
                _count: {
                    select: {
                        parties: true,
                        echeances: true,
                        diligences: true,
                    },
                },
            },
            orderBy: [{ statut: "asc" }, { updatedAt: "desc" }],
            take: limit,
        });

        // Convert Decimal fields to numbers and format
        const formattedAffaires = affaires.map((a) => ({
            ...a,
            tauxHoraire: a.tauxHoraire ? Number(a.tauxHoraire) : null,
            montantForfait: a.montantForfait ? Number(a.montantForfait) : null,
            provision: a.provision ? Number(a.provision) : null,
            montantAJ: a.montantAJ ? Number(a.montantAJ) : null,
            enjeuFinancier: a.enjeuFinancier ? Number(a.enjeuFinancier) : null,
        }));

        return NextResponse.json({ affaires: formattedAffaires });
    } catch (error) {
        console.error("Error fetching affaires:", error);
        return NextResponse.json(
            { error: "Failed to fetch affaires" },
            { status: 500 }
        );
    }
}

// POST /api/affaires - Create new affaire
export async function POST(request: NextRequest) {
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

        const body: AffaireCreateInput = await request.json();

        // Validation
        if (!body.intitule?.trim()) {
            return NextResponse.json(
                { error: "L'intitulé de l'affaire est requis" },
                { status: 400 }
            );
        }

        if (!body.clientId) {
            return NextResponse.json(
                { error: "Le client est requis" },
                { status: 400 }
            );
        }

        if (!body.domaine) {
            return NextResponse.json(
                { error: "Le domaine juridique est requis" },
                { status: 400 }
            );
        }

        // Verify client belongs to enterprise
        const client = await prisma.client.findFirst({
            where: {
                id: body.clientId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: "Client introuvable" },
                { status: 404 }
            );
        }

        // Generate affaire reference: AFF-YYYY-XXX
        const year = new Date().getFullYear();
        const lastAffaire = await prisma.affaire.findFirst({
            where: {
                entrepriseId: session.user.entrepriseId,
                reference: {
                    startsWith: `AFF-${year}`,
                },
            },
            orderBy: {
                reference: "desc",
            },
        });

        let nextNumber = 1;
        if (lastAffaire) {
            const lastNumber = parseInt(lastAffaire.reference.split("-")[2]);
            nextNumber = lastNumber + 1;
        }
        const reference = `AFF-${year}-${nextNumber.toString().padStart(3, "0")}`;

        // Create affaire
        const affaire = await prisma.affaire.create({
            data: {
                reference,
                intitule: body.intitule.trim(),
                description: body.description?.trim() || null,
                clientId: body.clientId,
                qualiteClient: (body.qualiteClient as any) || "DEMANDEUR",
                domaine: body.domaine as any,
                typeProcedure: (body.typeProcedure as any) || "CONTENTIEUX",
                juridiction: (body.juridiction as any) || null,
                chambre: body.chambre || null,
                numeroRG: body.numeroRG || null,
                numeroParquet: body.numeroParquet || null,
                dateOuverture: body.dateOuverture
                    ? new Date(body.dateOuverture)
                    : new Date(),
                dateFaits: body.dateFaits ? new Date(body.dateFaits) : null,
                typeHonoraires: (body.typeHonoraires as any) || "TEMPS_PASSE",
                tauxHoraire: body.tauxHoraire || null,
                montantForfait: body.montantForfait || null,
                provision: body.provision || null,
                montantAJ: body.montantAJ || null,
                enjeuFinancier: body.enjeuFinancier || null,
                responsableId: body.responsableId || null,
                statut: "ETUDE",
                conflitVerifie: false,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
            },
        });

        // Convert Decimal fields
        const formattedAffaire = {
            ...affaire,
            tauxHoraire: affaire.tauxHoraire
                ? Number(affaire.tauxHoraire)
                : null,
            montantForfait: affaire.montantForfait
                ? Number(affaire.montantForfait)
                : null,
            provision: affaire.provision ? Number(affaire.provision) : null,
            montantAJ: affaire.montantAJ ? Number(affaire.montantAJ) : null,
            enjeuFinancier: affaire.enjeuFinancier
                ? Number(affaire.enjeuFinancier)
                : null,
        };

        return NextResponse.json(
            { affaire: formattedAffaire },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating affaire:", error);
        return NextResponse.json(
            { error: "Failed to create affaire" },
            { status: 500 }
        );
    }
}
