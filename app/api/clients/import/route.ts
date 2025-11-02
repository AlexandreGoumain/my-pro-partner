import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientImportSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
  email: z
    .union([z.string().email("Email invalide"), z.literal(""), z.null(), z.undefined()])
    .transform((val) => (val === "" || !val ? null : val)),
  telephone: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
  adresse: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
  ville: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
  codePostal: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
  pays: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || "France"),
  notes: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || null),
});

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const body = await req.json();

    const { clients } = z
      .object({
        clients: z.array(clientImportSchema),
      })
      .parse(body);

    if (clients.length === 0) {
      return NextResponse.json(
        { message: "Aucun client à importer" },
        { status: 400 }
      );
    }

    if (clients.length > 1000) {
      return NextResponse.json(
        { message: "Maximum 1000 clients par import" },
        { status: 400 }
      );
    }

    // Check for duplicate emails in the import
    const emails = clients
      .map((c) => c.email)
      .filter((email): email is string => !!email && email.trim() !== "");
    const uniqueEmails = new Set(emails);

    if (emails.length !== uniqueEmails.size) {
      return NextResponse.json(
        { message: "Des emails en double ont été détectés dans l'import" },
        { status: 400 }
      );
    }

    // Check for duplicate phone numbers in the import
    const phones = clients
      .map((c) => c.telephone)
      .filter((phone): phone is string => !!phone && phone.trim() !== "");
    const uniquePhones = new Set(phones);

    if (phones.length !== uniquePhones.size) {
      return NextResponse.json(
        { message: "Des numéros de téléphone en double ont été détectés dans l'import" },
        { status: 400 }
      );
    }

    // Check for existing emails in database
    if (uniqueEmails.size > 0) {
      const existingEmailClients = await prisma.client.findMany({
        where: {
          entrepriseId,
          email: { in: Array.from(uniqueEmails) },
        },
        select: { email: true },
      });

      if (existingEmailClients.length > 0) {
        const existingEmails = existingEmailClients.map((c) => c.email).join(", ");
        return NextResponse.json(
          {
            message: `Les emails suivants existent déjà dans votre base: ${existingEmails}`,
          },
          { status: 400 }
        );
      }
    }

    // Check for existing phone numbers in database
    if (uniquePhones.size > 0) {
      const existingPhoneClients = await prisma.client.findMany({
        where: {
          entrepriseId,
          telephone: { in: Array.from(uniquePhones) },
        },
        select: { telephone: true, nom: true, prenom: true },
      });

      if (existingPhoneClients.length > 0) {
        const existingPhones = existingPhoneClients
          .map((c) => `${c.telephone} (${c.prenom ? `${c.nom} ${c.prenom}` : c.nom})`)
          .join(", ");
        return NextResponse.json(
          {
            message: `Les numéros de téléphone suivants existent déjà: ${existingPhones}`,
          },
          { status: 400 }
        );
      }
    }

    // Create clients in batch
    const createdClients = await prisma.client.createMany({
      data: clients.map((client) => ({
        ...client,
        email: client.email && client.email.trim() !== "" ? client.email : null,
        entrepriseId,
      })),
      skipDuplicates: true,
    });

    const totalSent = clients.length;
    const actuallyCreated = createdClients.count;
    const skipped = totalSent - actuallyCreated;

    let message = `${actuallyCreated} client(s) importé(s) avec succès`;
    if (skipped > 0) {
      message += ` (${skipped} ignoré(s) car déjà existant(s))`;
    }

    return NextResponse.json({
      message,
      count: actuallyCreated,
      total: totalSent,
      skipped,
    });
  } catch (error) {
    console.error("❌ Error importing clients:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Données invalides", errors: error.errors },
        { status: 400 }
      );
    }

    return handleTenantError(error);
  }
}
