import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/equipements-clients/[id] - Get single equipment with history
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const equipement = await prisma.equipementClient.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
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
                certificats: {
                    orderBy: { dateIntervention: "desc" },
                    take: 10,
                },
            },
        });

        if (!equipement) {
            return NextResponse.json(
                { error: "Équipement non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(equipement);
    } catch (error) {
        console.error("Error fetching equipement:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de l'équipement" },
            { status: 500 }
        );
    }
}

// PUT /api/equipements-clients/[id] - Update equipment
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        // Vérifier que l'équipement existe et appartient à l'entreprise
        const existing = await prisma.equipementClient.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Équipement non trouvé" },
                { status: 404 }
            );
        }

        const {
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
            statut,
            dernierEntretien,
            prochainEntretien,
            controleObligatoire,
            frequenceControleAnnuel,
            dernierControleAnnuel,
            prochainControleAnnuel,
            certificatValide,
            rendementPourcent,
            emissionsCO,
            notes,
        } = body;

        const equipement = await prisma.equipementClient.update({
            where: { id },
            data: {
                ...(type && { type }),
                ...(marque && { marque }),
                ...(modele !== undefined && { modele }),
                ...(numeroSerie !== undefined && { numeroSerie }),
                ...(puissanceKw !== undefined && {
                    puissanceKw: puissanceKw ? parseFloat(puissanceKw) : null,
                }),
                ...(typeEnergie !== undefined && { typeEnergie }),
                ...(dateInstallation !== undefined && {
                    dateInstallation: dateInstallation
                        ? new Date(dateInstallation)
                        : null,
                }),
                ...(dateMiseEnService !== undefined && {
                    dateMiseEnService: dateMiseEnService
                        ? new Date(dateMiseEnService)
                        : null,
                }),
                ...(installePar !== undefined && { installePar }),
                ...(garantieJusquau !== undefined && {
                    garantieJusquau: garantieJusquau
                        ? new Date(garantieJusquau)
                        : null,
                }),
                ...(emplacement !== undefined && { emplacement }),
                ...(adresse !== undefined && { adresse }),
                ...(codePostal !== undefined && { codePostal }),
                ...(ville !== undefined && { ville }),
                ...(accessibilite !== undefined && { accessibilite }),
                ...(statut && { statut }),
                ...(dernierEntretien !== undefined && {
                    dernierEntretien: dernierEntretien
                        ? new Date(dernierEntretien)
                        : null,
                }),
                ...(prochainEntretien !== undefined && {
                    prochainEntretien: prochainEntretien
                        ? new Date(prochainEntretien)
                        : null,
                }),
                ...(controleObligatoire !== undefined && {
                    controleObligatoire,
                }),
                ...(frequenceControleAnnuel !== undefined && {
                    frequenceControleAnnuel,
                }),
                ...(dernierControleAnnuel !== undefined && {
                    dernierControleAnnuel: dernierControleAnnuel
                        ? new Date(dernierControleAnnuel)
                        : null,
                }),
                ...(prochainControleAnnuel !== undefined && {
                    prochainControleAnnuel: prochainControleAnnuel
                        ? new Date(prochainControleAnnuel)
                        : null,
                }),
                ...(certificatValide !== undefined && { certificatValide }),
                ...(rendementPourcent !== undefined && {
                    rendementPourcent: rendementPourcent
                        ? parseFloat(rendementPourcent)
                        : null,
                }),
                ...(emissionsCO !== undefined && {
                    emissionsCO: emissionsCO ? parseFloat(emissionsCO) : null,
                }),
                ...(notes !== undefined && { notes }),
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

        return NextResponse.json(equipement);
    } catch (error) {
        console.error("Error updating equipement:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'équipement" },
            { status: 500 }
        );
    }
}

// DELETE /api/equipements-clients/[id] - Delete equipment
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Vérifier que l'équipement existe et appartient à l'entreprise
        const existing = await prisma.equipementClient.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Équipement non trouvé" },
                { status: 404 }
            );
        }

        await prisma.equipementClient.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting equipement:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'équipement" },
            { status: 500 }
        );
    }
}
