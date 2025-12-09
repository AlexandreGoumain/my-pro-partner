import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EQUIPEMENTS_CONTROLE_OBLIGATOIRE } from "@/lib/types/equipement";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { addYears } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

// GET /api/equipements-clients - List all equipment
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Security: Check capability for equipment tracking
        const capabilityCheck = await requireCapability("suivi_bien");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");
        const type = searchParams.get("type");
        const statut = searchParams.get("statut");
        const controleUrgent = searchParams.get("controleUrgent"); // Dans les 30 jours

        const where: Record<string, unknown> = {
            entrepriseId: session.user.entrepriseId,
        };

        if (clientId) where.clientId = clientId;
        if (type) where.type = type;
        if (statut) where.statut = statut;

        if (controleUrgent === "true") {
            const dans30Jours = new Date();
            dans30Jours.setDate(dans30Jours.getDate() + 30);
            where.prochainControleAnnuel = {
                lte: dans30Jours,
            };
            where.controleObligatoire = true;
        }

        const equipements = await prisma.equipementClient.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                    },
                },
            },
            orderBy: [{ prochainControleAnnuel: "asc" }, { createdAt: "desc" }],
        });

        return NextResponse.json(equipements);
    } catch (error) {
        console.error("Error fetching equipements:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des équipements" },
            { status: 500 }
        );
    }
}

// POST /api/equipements-clients - Create new equipment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Security: Check capability for equipment tracking
        const capabilityCheck = await requireCapability("suivi_bien");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const {
            clientId,
            type,
            marque,
            modele,
            numeroSerie,
            puissanceKw,
            typeEnergie,
            dateInstallation,
            dateMiseEnService,
            installePar,
            garantieJusquau,
            emplacement,
            adresse,
            codePostal,
            ville,
            accessibilite,
            controleObligatoire,
            frequenceControleAnnuel,
            notes,
        } = body;

        // Validation
        if (!clientId || !type || !marque) {
            return NextResponse.json(
                { error: "Client, type et marque sont requis" },
                { status: 400 }
            );
        }

        // Vérifier si le type nécessite un contrôle obligatoire
        const needsObligatoryControl =
            EQUIPEMENTS_CONTROLE_OBLIGATOIRE.includes(type);

        // Calculer la prochaine date de contrôle si contrôle obligatoire
        let prochainControleAnnuel: Date | null = null;
        if (needsObligatoryControl || controleObligatoire) {
            const baseDate = dateMiseEnService
                ? new Date(dateMiseEnService)
                : new Date();
            prochainControleAnnuel = addYears(baseDate, 1);
        }

        const equipement = await prisma.equipementClient.create({
            data: {
                clientId,
                entrepriseId: session.user.entrepriseId,
                type,
                marque,
                modele: modele || null,
                numeroSerie: numeroSerie || null,
                puissanceKw: puissanceKw ? parseFloat(puissanceKw) : null,
                typeEnergie: typeEnergie || null,
                dateInstallation: dateInstallation
                    ? new Date(dateInstallation)
                    : null,
                dateMiseEnService: dateMiseEnService
                    ? new Date(dateMiseEnService)
                    : null,
                installePar: installePar || null,
                garantieJusquau: garantieJusquau
                    ? new Date(garantieJusquau)
                    : null,
                emplacement: emplacement || null,
                adresse: adresse || null,
                codePostal: codePostal || null,
                ville: ville || null,
                accessibilite: accessibilite || null,
                controleObligatoire:
                    needsObligatoryControl || controleObligatoire || false,
                frequenceControleAnnuel: frequenceControleAnnuel || 1,
                prochainControleAnnuel,
                notes: notes || null,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                    },
                },
            },
        });

        return NextResponse.json(equipement, { status: 201 });
    } catch (error) {
        console.error("Error creating equipement:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'équipement" },
            { status: 500 }
        );
    }
}
