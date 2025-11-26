import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TYPE_EQUIPEMENT_LABELS } from "@/lib/types/intervention";
import { differenceInDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

// GET /api/entretiens-a-planifier - Get upcoming maintenance to schedule
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const joursAvant = parseInt(searchParams.get("jours") || "60");
        const includeRetard = searchParams.get("includeRetard") !== "false";

        const entrepriseId = session.user.entrepriseId;
        const now = new Date();
        const dateLimite = new Date();
        dateLimite.setDate(dateLimite.getDate() + joursAvant);

        // 1. Équipements avec contrôle annuel à venir ou en retard
        const equipementsControle = await prisma.equipementClient.findMany({
            where: {
                entrepriseId,
                controleObligatoire: true,
                OR: [
                    // Contrôles à venir dans les X jours
                    {
                        prochainControleAnnuel: {
                            lte: dateLimite,
                            gte: includeRetard ? undefined : now,
                        },
                    },
                    // Contrôles en retard (si inclus)
                    ...(includeRetard
                        ? [
                              {
                                  prochainControleAnnuel: {
                                      lt: now,
                                  },
                              },
                          ]
                        : []),
                ],
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                    },
                },
            },
            orderBy: { prochainControleAnnuel: "asc" },
        });

        // 2. Équipements avec entretien prévu à venir
        const equipementsEntretien = await prisma.equipementClient.findMany({
            where: {
                entrepriseId,
                prochainEntretien: {
                    lte: dateLimite,
                    gte: now,
                },
                // Exclure ceux déjà dans la liste contrôle
                id: {
                    notIn: equipementsControle.map((e) => e.id),
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                    },
                },
            },
            orderBy: { prochainEntretien: "asc" },
        });

        // 3. Équipements avec garantie qui expire bientôt
        const equipementsGarantie = await prisma.equipementClient.findMany({
            where: {
                entrepriseId,
                garantieJusquau: {
                    lte: dateLimite,
                    gte: now,
                },
                // Exclure ceux déjà dans les autres listes
                id: {
                    notIn: [
                        ...equipementsControle.map((e) => e.id),
                        ...equipementsEntretien.map((e) => e.id),
                    ],
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                    },
                },
            },
            orderBy: { garantieJusquau: "asc" },
        });

        // Formatter les résultats
        const entretiens = [
            // Contrôles annuels
            ...equipementsControle.map((eq) => {
                const dateEcheance = eq.prochainControleAnnuel!;
                const joursRestants = differenceInDays(dateEcheance, now);
                return {
                    id: `ctrl-${eq.id}`,
                    equipementId: eq.id,
                    type: "CONTROLE_ANNUEL" as const,
                    dateEcheance: dateEcheance.toISOString(),
                    joursRestants,
                    enRetard: joursRestants < 0,
                    priorite:
                        joursRestants < 0
                            ? "critique"
                            : joursRestants < 15
                              ? "haute"
                              : "normale",
                    client: eq.client,
                    equipement: {
                        type: eq.type,
                        typeLabel: TYPE_EQUIPEMENT_LABELS[eq.type] || eq.type,
                        marque: eq.marque,
                        modele: eq.modele,
                    },
                };
            }),
            // Entretiens planifiés
            ...equipementsEntretien.map((eq) => {
                const dateEcheance = eq.prochainEntretien!;
                const joursRestants = differenceInDays(dateEcheance, now);
                return {
                    id: `ent-${eq.id}`,
                    equipementId: eq.id,
                    type: "ENTRETIEN" as const,
                    dateEcheance: dateEcheance.toISOString(),
                    joursRestants,
                    enRetard: false,
                    priorite: joursRestants < 7 ? "haute" : "normale",
                    client: eq.client,
                    equipement: {
                        type: eq.type,
                        typeLabel: TYPE_EQUIPEMENT_LABELS[eq.type] || eq.type,
                        marque: eq.marque,
                        modele: eq.modele,
                    },
                };
            }),
            // Garanties expirantes
            ...equipementsGarantie.map((eq) => {
                const dateEcheance = eq.garantieJusquau!;
                const joursRestants = differenceInDays(dateEcheance, now);
                return {
                    id: `gar-${eq.id}`,
                    equipementId: eq.id,
                    type: "GARANTIE_EXPIRE" as const,
                    dateEcheance: dateEcheance.toISOString(),
                    joursRestants,
                    enRetard: false,
                    priorite: "basse" as const,
                    client: eq.client,
                    equipement: {
                        type: eq.type,
                        typeLabel: TYPE_EQUIPEMENT_LABELS[eq.type] || eq.type,
                        marque: eq.marque,
                        modele: eq.modele,
                    },
                };
            }),
        ];

        // Trier par priorité puis par date
        const prioriteOrder: Record<string, number> = {
            critique: 0,
            haute: 1,
            normale: 2,
            basse: 3,
        };
        entretiens.sort((a, b) => {
            const prioriteDiff =
                (prioriteOrder[a.priorite] ?? 3) -
                (prioriteOrder[b.priorite] ?? 3);
            if (prioriteDiff !== 0) return prioriteDiff;
            return a.joursRestants - b.joursRestants;
        });

        // Stats résumé
        const stats = {
            total: entretiens.length,
            enRetard: entretiens.filter((e) => e.enRetard).length,
            dans7Jours: entretiens.filter(
                (e) => !e.enRetard && e.joursRestants <= 7
            ).length,
            dans30Jours: entretiens.filter(
                (e) => !e.enRetard && e.joursRestants <= 30
            ).length,
        };

        return NextResponse.json({ entretiens, stats });
    } catch (error) {
        console.error("Error fetching entretiens à planifier:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des entretiens" },
            { status: 500 }
        );
    }
}
