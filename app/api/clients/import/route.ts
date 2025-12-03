import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientImportSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
    email: z
        .union([z.string().email("Email invalide"), z.literal(""), z.null(), z.undefined()])
        .transform((val) => (val === "" || !val ? null : val))
        .nullable(),
    telephone: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
    adresse: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
    ville: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
    codePostal: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
    pays: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : "France"))
        .default("France"),
    notes: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((val) => (val && val.trim() !== "" ? val : null))
        .nullable(),
});

const importRequestSchema = z.object({
    clients: z.array(clientImportSchema),
});

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();

            const result = importRequestSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { clients } = result.data;

            if (clients.length === 0) {
                throw new ValidationError("Aucun client à importer");
            }

            if (clients.length > 1000) {
                throw new ValidationError("Maximum 1000 clients par import");
            }

            // Check for duplicate emails in the import
            const emails = clients
                .map((c) => c.email)
                .filter((email): email is string => !!email && email.trim() !== "");
            const uniqueEmails = new Set(emails);

            if (emails.length !== uniqueEmails.size) {
                throw new ValidationError("Des emails en double ont été détectés dans l'import");
            }

            // Check for duplicate phone numbers in the import
            const phones = clients
                .map((c) => c.telephone)
                .filter((phone): phone is string => !!phone && phone.trim() !== "");
            const uniquePhones = new Set(phones);

            if (phones.length !== uniquePhones.size) {
                throw new ValidationError("Des numéros de téléphone en double ont été détectés dans l'import");
            }

            // Check for existing emails in database
            if (uniqueEmails.size > 0) {
                const existingEmailClients = await prisma.client.findMany({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        email: { in: Array.from(uniqueEmails) },
                    },
                    select: { email: true },
                });

                if (existingEmailClients.length > 0) {
                    const existingEmails = existingEmailClients.map((c) => c.email).join(", ");
                    throw new ValidationError(
                        `Les emails suivants existent déjà dans votre base: ${existingEmails}`
                    );
                }
            }

            // Check for existing phone numbers in database
            if (uniquePhones.size > 0) {
                const existingPhoneClients = await prisma.client.findMany({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        telephone: { in: Array.from(uniquePhones) },
                    },
                    select: { telephone: true, nom: true, prenom: true },
                });

                if (existingPhoneClients.length > 0) {
                    const existingPhones = existingPhoneClients
                        .map((c) => `${c.telephone} (${c.prenom ? `${c.nom} ${c.prenom}` : c.nom})`)
                        .join(", ");
                    throw new ValidationError(
                        `Les numéros de téléphone suivants existent déjà: ${existingPhones}`
                    );
                }
            }

            // Create clients in batch
            const createdClients = await prisma.client.createMany({
                data: clients.map((client) => ({
                    nom: client.nom,
                    prenom: client.prenom || null,
                    email: client.email && client.email.trim() !== "" ? client.email : null,
                    telephone: client.telephone || null,
                    adresse: client.adresse || null,
                    ville: client.ville || null,
                    codePostal: client.codePostal || null,
                    pays: client.pays || "France",
                    notes: client.notes || null,
                    entrepriseId: ctx.entrepriseId,
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
        },
        {
            context: { resourceName: "Client", operation: "import" },
        }
    );
}
