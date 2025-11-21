import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { reparationCreateSchema } from "@/lib/validation";
import { ReparationService } from "@/lib/services/reparation.service";

// POST: Create new repair ticket
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId, user } = await requireTenantAuth();

    const body = await req.json();
    const result = reparationCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify client exists and belongs to entreprise
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client introuvable" },
        { status: 404 }
      );
    }

    if (client.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Generate reference
    const numero = await ReparationService.generateReference(entrepriseId);

    // Create repair ticket
    const reparation = await prisma.reparation.create({
      data: {
        numero,
        reference: data.reference || undefined,
        clientId: data.clientId,
        typeAppareil: data.typeAppareil,
        marque: data.marque || undefined,
        modele: data.modele || undefined,
        numeroSerie: data.numeroSerie || undefined,
        motAuthentification: data.motAuthentification || undefined,
        panne: data.panne,
        etatVisuel: data.etatVisuel || undefined,
        accessoires: data.accessoires || undefined,
        priorite: data.priorite,
        storeId: data.storeId || undefined,
        registerId: data.registerId || undefined,
        notesInternes: data.notesInternes || undefined,
        entrepriseId,
        createdBy: user.id,
      },
      include: {
        client: true,
        store: true,
        register: true,
      },
    });

    // Create history entry
    await prisma.reparationHistorique.create({
      data: {
        reparationId: reparation.id,
        action: "CREATED",
        description: "Réparation créée",
        metadata: {
          statut: "DEPOSE",
        },
        createdBy: user.id,
      },
    });

    return NextResponse.json(reparation, { status: 201 });
  }, { resourceName: "Reparation", operation: "create" });
}

// GET: List all repairs
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { entrepriseId } = await requireTenantAuth();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const statut = searchParams.get("statut");
    const clientId = searchParams.get("clientId");
    const technicienId = searchParams.get("technicienId");
    const priorite = searchParams.get("priorite");
    const search = searchParams.get("search");
    const storeId = searchParams.get("storeId");

    // Build where clause
    const where: any = { entrepriseId };

    if (statut) {
      where.statut = statut;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (technicienId) {
      where.technicienId = technicienId;
    }

    if (priorite) {
      where.priorite = priorite;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: "insensitive" } },
        { numeroSerie: { contains: search, mode: "insensitive" } },
        { marque: { contains: search, mode: "insensitive" } },
        { modele: { contains: search, mode: "insensitive" } },
        { client: { nom: { contains: search, mode: "insensitive" } } },
      ];
    }

    const total = await prisma.reparation.count({ where });

    const reparations = await prisma.reparation.findMany({
      where,
      include: {
        client: true,
        technicien: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: true,
        lignesPieces: true,
        _count: {
          select: {
            interventions: true,
            historique: true,
          },
        },
      },
      orderBy: {
        dateDepot: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      items: reparations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }, { resourceName: "Reparation", operation: "list" });
}
