import { authOptions } from "@/lib/auth";
import {
    ECHEANCES_FISCALES,
    calculerDateEcheance,
    echeanceApplicable,
    type ClientComptable,
} from "@/lib/comptabilite/calendrier-fiscal";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
    missionId: string;
    annee: number;
}

// POST /api/echeances/generer - Generate échéances for a mission/dossier
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

        const body: GenerateRequest = await request.json();
        const { missionId, annee } = body;

        if (!missionId || !annee) {
            return NextResponse.json(
                { error: "missionId et annee sont requis" },
                { status: 400 }
            );
        }

        // Fetch mission with client info
        const mission = await prisma.mission.findFirst({
            where: {
                id: missionId,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: true,
            },
        });

        if (!mission) {
            return NextResponse.json(
                { error: "Dossier introuvable" },
                { status: 404 }
            );
        }

        const client = mission.client;

        // Build client profile for fiscal calendar
        const clientComptable: ClientComptable = {
            id: client.id,
            nom: client.nom,
            formeJuridique: (client.formeJuridique as any) || "AUTRE",
            regimeFiscal: (client.regimeFiscal as any) || "REEL_NORMAL",
            regimeTVA: (client.regimeTVA as any) || "MENSUEL",
            typeImposition: (client.typeImposition as any) || "IS",
            dateClotureExercice: client.dateClotureExercice || "12-31",
            avecSalaries: client.avecSalaries || false,
            effectif: client.effectif || 0,
        };

        // Generate échéances based on templates
        const echeancesToCreate: any[] = [];
        const now = new Date();

        for (const template of ECHEANCES_FISCALES) {
            if (!echeanceApplicable(template, clientComptable)) continue;

            if (template.periodicite === "MENSUEL") {
                // Generate for each month
                for (let mois = 1; mois <= 12; mois++) {
                    const dateEcheance = calculerDateEcheance(
                        template,
                        annee,
                        mois,
                        clientComptable.dateClotureExercice
                    );

                    // Only create future échéances or current month
                    if (dateEcheance < now) continue;

                    const moisNom = new Date(
                        annee,
                        mois - 1
                    ).toLocaleDateString("fr-FR", { month: "long" });

                    echeancesToCreate.push({
                        missionId,
                        clientId: client.id,
                        entrepriseId: session.user.entrepriseId,
                        type: template.type,
                        libelle: `${template.libelle} - ${moisNom} ${annee}`,
                        dateEcheance,
                        periodicite: template.periodicite,
                        exerciceFiscal: String(annee),
                        periodeDebut: new Date(annee, mois - 1, 1),
                        periodeFin: new Date(annee, mois, 0),
                        notes: template.description,
                        statut: "A_VENIR",
                    });
                }
            } else if (template.periodicite === "TRIMESTRIEL") {
                // Generate for each quarter
                for (let trimestre = 1; trimestre <= 4; trimestre++) {
                    const moisFin = trimestre * 3;
                    const dateEcheance = calculerDateEcheance(
                        template,
                        annee,
                        moisFin,
                        clientComptable.dateClotureExercice
                    );

                    if (dateEcheance < now) continue;

                    echeancesToCreate.push({
                        missionId,
                        clientId: client.id,
                        entrepriseId: session.user.entrepriseId,
                        type: template.type,
                        libelle: `${template.libelle} - T${trimestre} ${annee}`,
                        dateEcheance,
                        periodicite: template.periodicite,
                        exerciceFiscal: String(annee),
                        periodeDebut: new Date(annee, (trimestre - 1) * 3, 1),
                        periodeFin: new Date(annee, trimestre * 3, 0),
                        notes: template.description,
                        statut: "A_VENIR",
                    });
                }
            } else if (template.periodicite === "ANNUEL") {
                const dateEcheance = calculerDateEcheance(
                    template,
                    annee,
                    undefined,
                    clientComptable.dateClotureExercice
                );

                if (dateEcheance < now) continue;

                echeancesToCreate.push({
                    missionId,
                    clientId: client.id,
                    entrepriseId: session.user.entrepriseId,
                    type: template.type,
                    libelle: `${template.libelle} ${annee}`,
                    dateEcheance,
                    periodicite: template.periodicite,
                    exerciceFiscal: String(annee),
                    notes: template.description,
                    statut: "A_VENIR",
                });
            }
        }

        // Check for duplicates (same libelle and dateEcheance)
        const existingEcheances = await prisma.echeanceFiscale.findMany({
            where: {
                missionId,
                exerciceFiscal: String(annee),
            },
            select: {
                libelle: true,
                dateEcheance: true,
            },
        });

        const existingSet = new Set(
            existingEcheances.map(
                (e) => `${e.libelle}|${e.dateEcheance.toISOString()}`
            )
        );

        const newEcheances = echeancesToCreate.filter(
            (e) =>
                !existingSet.has(`${e.libelle}|${e.dateEcheance.toISOString()}`)
        );

        if (newEcheances.length === 0) {
            return NextResponse.json({
                message: "Toutes les échéances existent déjà",
                created: 0,
            });
        }

        // Create all échéances
        await prisma.echeanceFiscale.createMany({
            data: newEcheances,
        });

        return NextResponse.json({
            message: `${newEcheances.length} échéances créées`,
            created: newEcheances.length,
        });
    } catch (error) {
        console.error("Error generating echeances:", error);
        return NextResponse.json(
            { error: "Failed to generate echeances" },
            { status: 500 }
        );
    }
}
