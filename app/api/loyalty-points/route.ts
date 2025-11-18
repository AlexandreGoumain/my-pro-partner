import { createCrudRoutes } from "@/lib/api/crud-factory";
import { mouvementPointsCreateSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { TypeMouvementPoints } from "@/lib/generated/prisma";

export const { GET, POST } = createCrudRoutes({
  modelName: "mouvementPoints",
  resourceName: "Mouvement de points",
  createSchema: mouvementPointsCreateSchema,
  updateSchema: mouvementPointsCreateSchema, // Not used for loyalty points

  include: {
    client: {
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
      },
    },
  },

  orderBy: { createdAt: "desc" },

  // Custom filters for clientId and type
  customWhere: (searchParams) => {
    const clientId = searchParams.get("clientId");
    const type = searchParams.get("type");

    return {
      ...(clientId && { clientId }),
      ...(type && { type: type as TypeMouvementPoints }),
    };
  },

  // Business logic for creating a movement
  beforeCreate: async (data, entrepriseId) => {
    const { clientId, type, points, description, reference, dateExpiration } = data;

    // Verify that the client exists and belongs to the tenant
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        entrepriseId,
      },
    });

    if (!client) {
      throw new Error("Client non trouvé");
    }

    // Calculate new points balance
    let pointsChange = points;
    if (type === "DEPENSE" || type === "EXPIRATION") {
      pointsChange = -Math.abs(points);
    } else {
      pointsChange = Math.abs(points);
    }

    const newBalance = client.points_solde + pointsChange;

    if (newBalance < 0) {
      throw new Error("Le solde de points ne peut pas être négatif");
    }

    // Store the new balance to update later (will be used in afterCreate)
    const dataWithBalance = {
      type,
      points: Math.abs(points),
      description: description || undefined,
      reference: reference || undefined,
      dateExpiration: dateExpiration ? new Date(dateExpiration) : undefined,
      clientId,
      entrepriseId,
      _newBalance: newBalance, // Internal property for afterCreate hook
    };

    return dataWithBalance;
  },

  // Update client balance after creating movement
  afterCreate: async (mouvement) => {
    // Update client balance
    await prisma.client.update({
      where: { id: mouvement.clientId },
      data: {
        points_solde: (mouvement as typeof mouvement & { _newBalance: number })._newBalance,
      },
    });
  },
});
