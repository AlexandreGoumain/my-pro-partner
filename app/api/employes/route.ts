import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/employes
 * List all employees for the entreprise
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const params = getPaginationParams(searchParams);
        const search = searchParams.get("search") || "";
        const actifParam = searchParams.get("actif");

        // Build where clause
        const where: Record<string, unknown> = {
            entrepriseId: session.user.entrepriseId,
        };

        if (search) {
            where.OR = [
                { nom: { contains: search, mode: "insensitive" } },
                { prenom: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (actifParam !== null) {
            where.actif = actifParam === "true";
        }

        // Get total count
        const total = await prisma.employe.count({ where });

        // Get items with pagination
        const items = await prisma.employe.findMany({
            where,
            include: {
                disponibilites: true,
                _count: {
                    select: {
                        coursAnimes: true,
                        seancesAnimees: true,
                        rendezVous: true,
                    },
                },
            },
            orderBy: [{ nom: "asc" }, { prenom: "asc" }],
            skip: params.skip,
            take: params.limit,
        });

        // Map _count to expected structure
        const mappedItems = items.map((item) => ({
            ...item,
            _count: item._count
                ? {
                      coursAssignes: item._count.coursAnimes,
                      seancesAnimees: item._count.seancesAnimees,
                      rendezVous: item._count.rendezVous,
                  }
                : undefined,
        }));

        return NextResponse.json(
            createPaginatedResponse(mappedItems, total, params)
        );
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/employes
 * Create a new employee
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const {
            nom,
            prenom,
            email,
            telephone,
            couleur,
            actif,
            disponibilites,
            specialites,
            bio,
            certifications,
        } = body;

        // Validation
        if (!nom || nom.trim() === "") {
            return NextResponse.json(
                { error: "Le nom est requis" },
                { status: 400 }
            );
        }

        if (!prenom || prenom.trim() === "") {
            return NextResponse.json(
                { error: "Le prénom est requis" },
                { status: 400 }
            );
        }

        // Create employee with disponibilites
        const item = await prisma.employe.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                nom: nom.trim(),
                prenom: prenom.trim(),
                email: email?.trim() || null,
                telephone: telephone?.trim() || null,
                couleur: couleur || null,
                actif: actif !== false,
                // Coach fields (fitness)
                specialites: specialites || null,
                bio: bio?.trim() || null,
                certifications: certifications?.trim() || null,
                disponibilites: disponibilites
                    ? {
                          create: disponibilites.map(
                              (d: {
                                  jourSemaine: number;
                                  heureDebut: string;
                                  heureFin: string;
                                  pause?: boolean;
                              }) => ({
                                  jourSemaine: d.jourSemaine,
                                  heureDebut: d.heureDebut,
                                  heureFin: d.heureFin,
                                  pause: d.pause || false,
                              })
                          ),
                      }
                    : undefined,
            },
            include: {
                disponibilites: true,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating employee:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
