import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { emailService } from "@/lib/email/email-service";
import { PaymentReminderEmail } from "@/lib/email/templates/payment-reminder";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================
// POST /api/clients/[id]/send-reminder - Send payment reminder to client
// ============================================

export async function POST(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id: clientId } = await params;

            // Get client with tenant isolation
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client non trouvé");
            }

            // Validate client has email
            if (!client.email) {
                throw new BusinessError(
                    "Le client n'a pas d'adresse email. Veuillez ajouter une adresse email au client."
                );
            }

            // Get all unpaid invoices for this client
            const unpaidInvoices = await prisma.document.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    clientId,
                    type: "FACTURE",
                    statut: {
                        in: ["ENVOYE", "ACCEPTE"],
                    },
                    reste_a_payer: {
                        gt: 0,
                    },
                },
                orderBy: {
                    dateEcheance: "asc",
                },
            });

            if (unpaidInvoices.length === 0) {
                throw new BusinessError("Ce client n'a pas de factures impayées");
            }

            // Get entreprise info
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
                select: {
                    nom: true,
                    email: true,
                    parametres: {
                        select: {
                            telephone: true,
                        },
                    },
                },
            });

            // Calculate total due and format invoices for email
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const formattedInvoices = unpaidInvoices.map((invoice) => {
                const dateEcheance = new Date(
                    invoice.dateEcheance || invoice.dateEmission
                );
                const timeDiff = today.getTime() - dateEcheance.getTime();
                const joursRetard = Math.max(
                    0,
                    Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
                );

                return {
                    numero: invoice.numero,
                    dateEmission: new Intl.DateTimeFormat("fr-FR").format(
                        new Date(invoice.dateEmission)
                    ),
                    dateEcheance: new Intl.DateTimeFormat("fr-FR").format(
                        dateEcheance
                    ),
                    montant: Number(invoice.reste_a_payer),
                    joursRetard,
                };
            });

            const totalDue = unpaidInvoices.reduce(
                (sum, inv) => sum + Number(inv.reste_a_payer),
                0
            );

            // Get default payment instructions from any invoice (they should be similar)
            const paymentInstructions =
                unpaidInvoices[0].conditions_paiement || undefined;

            // Render email HTML from React template
            const emailHtml = await render(
                PaymentReminderEmail({
                    clientName: client.nom || "",
                    clientFirstName: client.prenom || "",
                    unpaidInvoices: formattedInvoices,
                    totalDue,
                    entrepriseName: entreprise?.nom || "MyProPartner",
                    entrepriseEmail: entreprise?.email || undefined,
                    entreprisePhone: entreprise?.parametres?.telephone || undefined,
                    paymentInstructions,
                })
            );

            // Send email
            const result = await emailService.sendEmail({
                to: client.email,
                subject: `Rappel de paiement - ${entreprise?.nom || "MyProPartner"}`,
                html: emailHtml,
                fromName: entreprise?.nom || "MyProPartner",
                replyTo: entreprise?.email || undefined,
            });

            if (!result.success) {
                throw new BusinessError(`Erreur lors de l'envoi de l'email : ${result.error}`);
            }

            return NextResponse.json({
                success: true,
                message: `Rappel de paiement envoyé avec succès à ${client.email}`,
                invoiceCount: unpaidInvoices.length,
                totalDue,
                emailId: result.messageId,
            });
        },
        {
            context: { resourceName: "Client", operation: "sendReminder" },
        }
    );
}
