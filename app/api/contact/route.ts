import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";
import { publicFormLimiter, getClientIp } from "@/lib/rate-limit";

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

// Schéma de validation
const contactSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    company: z.string().optional(),
    phone: z.string().optional(),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
    // Honeypot: ce champ doit rester vide (protection anti-bot)
    website: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const { success, limit, remaining, reset } = await publicFormLimiter.limit(ip);

        if (!success) {
            return NextResponse.json(
                {
                    error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
                    rateLimitReset: new Date(reset).toISOString()
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                    }
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
        const contact = await prisma.contactMessage.create({
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

        console.error("Contact error:", error);
        return NextResponse.json(
            { error: "Une erreur s'est produite" },
            { status: 500 }
        );
    }
}
