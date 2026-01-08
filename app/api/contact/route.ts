import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";
import { publicFormLimiter, getClientIp, safeRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour échapper le HTML (prévention XSS)
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Schéma de validation renforcé
const contactSchema = z.object({
    name: z
        .string()
        .min(1, "Le nom est requis")
        .max(100, "Nom trop long")
        .transform((val) => val.trim()),
    email: z
        .string()
        .email("Email invalide")
        .max(255, "Email trop long")
        .transform((val) => val.toLowerCase().trim()),
    company: z
        .string()
        .max(100, "Nom d'entreprise trop long")
        .optional()
        .transform((val) => val?.trim()),
    phone: z
        .string()
        .max(20, "Numéro trop long")
        .regex(/^[\d\s+\-().]*$/, "Format de téléphone invalide")
        .optional()
        .transform((val) => val?.trim()),
    message: z
        .string()
        .min(10, "Le message doit contenir au moins 10 caractères")
        .max(5000, "Message trop long"),
    // Honeypot: ce champ doit rester vide (protection anti-bot)
    website: z.string().max(100).optional(),
});

export async function POST(request: Request) {
    const ip = getClientIp(request);

    try {
        // Rate limiting avec gestion d'erreur gracieuse
        const rateLimitResult = await safeRateLimit(publicFormLimiter, ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
                    rateLimitReset: rateLimitResult.reset
                        ? new Date(rateLimitResult.reset).toISOString()
                        : undefined,
                },
                {
                    status: 429,
                    headers: {
                        ...(rateLimitResult.limit && {
                            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
                        }),
                        ...(rateLimitResult.remaining !== undefined && {
                            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
                        }),
                        ...(rateLimitResult.reset && {
                            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
                        }),
                    },
                }
            );
        }

        const body = await request.json();

        // Validation
        const validatedData = contactSchema.parse(body);

        // Honeypot: si le champ "website" est rempli, c'est un bot
        if (validatedData.website && validatedData.website.trim() !== "") {
            // On retourne un succès pour tromper le bot, mais on ne fait rien
            return NextResponse.json({
                success: true,
                message: "Message envoyé avec succès",
            });
        }

        // Créer le message de contact
        await prisma.contactMessage.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                company: validatedData.company,
                phone: validatedData.phone,
                message: validatedData.message,
            },
        });

        // Envoyer email de notification (si configuré)
        if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('YOUR_RESEND_API_KEY')) {
            try {
                const recipientEmail = process.env.RESEND_TO_EMAIL || process.env.RESEND_FROM_EMAIL || "contact@mypropartner.com";

                await resend.emails.send({
                    from: `${process.env.RESEND_FROM_NAME || 'MyProPartner'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
                    to: recipientEmail,
                    replyTo: validatedData.email,
                    subject: `Nouveau message de contact - ${escapeHtml(validatedData.name)}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #000; margin-bottom: 24px;">Nouveau message de contact</h2>

                            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                                <p style="margin: 0 0 12px 0;"><strong>Nom:</strong> ${escapeHtml(validatedData.name)}</p>
                                <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${escapeHtml(validatedData.email)}</p>
                                ${validatedData.company ? `<p style="margin: 0 0 12px 0;"><strong>Entreprise:</strong> ${escapeHtml(validatedData.company)}</p>` : ''}
                                ${validatedData.phone ? `<p style="margin: 0;"><strong>Téléphone:</strong> ${escapeHtml(validatedData.phone)}</p>` : ''}
                            </div>

                            <div style="background: #fff; border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px;">
                                <p style="margin: 0 0 8px 0; font-weight: 600;">Message:</p>
                                <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(validatedData.message)}</p>
                            </div>

                            <p style="margin-top: 24px; color: #666; font-size: 14px;">
                                Reçu le ${new Date().toLocaleString('fr-FR')}
                            </p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error("Failed to send notification email:", emailError);
                // Ne pas bloquer la requête si l'email échoue
            }
        }

        return NextResponse.json({
            success: true,
            message: "Message envoyé avec succès",
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }

        console.error("[Contact] Error details:", {
            type: error?.constructor?.name,
            message: error instanceof Error ? error.message : String(error),
            ip,
        });
        return NextResponse.json(
            { error: "Une erreur s'est produite" },
            { status: 500 }
        );
    }
}
