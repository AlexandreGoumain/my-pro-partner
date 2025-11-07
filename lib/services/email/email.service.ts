/**
 * Email Service using Resend
 * Handles sending emails for client portal
 *
 * Setup required:
 * - Add to .env:
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM_EMAIL=onboarding@resend.dev (or your verified domain email)
 *   RESEND_FROM_NAME=Your Company Name
 */

import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
    if (resend) {
        return resend;
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn(
            "[Email Service] Resend API key not configured. Emails will be logged to console only."
        );
        return null;
    }

    resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export class EmailService {
    static async sendEmail(options: SendEmailOptions): Promise<boolean> {
        try {
            const client = getResend();

            if (!client) {
                // In development or when Resend not configured, log to console
                console.log("\n=== EMAIL (NOT SENT - NO RESEND CONFIG) ===");
                console.log("To:", options.to);
                console.log("Subject:", options.subject);
                console.log("Text:", options.text || "No text version");
                console.log("HTML preview:", options.html.substring(0, 200) + "...");
                console.log("=========================================\n");
                return true;
            }

            const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
            const fromName = process.env.RESEND_FROM_NAME || "ERP Artisan";

            await client.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            console.log(`[Email Service] Email sent to ${options.to}`);
            return true;
        } catch (error) {
            console.error("[Email Service] Failed to send email:", error);
            return false;
        }
    }

    static async sendPasswordResetEmail(
        email: string,
        resetToken: string,
        clientName: string
    ): Promise<boolean> {
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/reset-password?token=${resetToken}`;

        const html = this.getPasswordResetTemplate(
            clientName,
            resetLink,
            resetToken
        );
        const text = `
Bonjour ${clientName},

Vous avez demandé à réinitialiser votre mot de passe pour accéder à votre espace client.

Pour définir un nouveau mot de passe, cliquez sur le lien ci-dessous :
${resetLink}

Ce lien est valable pendant 1 heure.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.

Cordialement,
L'équipe
        `.trim();

        return this.sendEmail({
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html,
            text,
        });
    }

    static async sendWelcomeEmail(
        email: string,
        temporaryPassword: string,
        clientName: string
    ): Promise<boolean> {
        const loginLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/login`;

        const html = this.getWelcomeTemplate(
            clientName,
            email,
            temporaryPassword,
            loginLink
        );
        const text = `
Bonjour ${clientName},

Bienvenue sur votre espace client !

Votre compte a été créé avec succès. Voici vos identifiants de connexion :

Email : ${email}
Mot de passe temporaire : ${temporaryPassword}

Pour accéder à votre espace client, rendez-vous sur :
${loginLink}

Important : Nous vous recommandons de changer votre mot de passe dès votre première connexion.

Cordialement,
L'équipe
        `.trim();

        return this.sendEmail({
            to: email,
            subject: "Bienvenue sur votre espace client",
            html,
            text,
        });
    }

    // Email templates with Apple-inspired design
    private static getPasswordResetTemplate(
        clientName: string,
        resetLink: string,
        resetToken: string
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Réinitialisation de mot de passe</h1>
        </div>

        <!-- Content -->
        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour ${clientName},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Vous avez demandé à réinitialiser votre mot de passe pour accéder à votre espace client.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: rgba(0,0,0,0.6); margin: 24px 0 0 0;">
                Ce lien est valable pendant <strong>1 heure</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
            </p>
        </div>

        <!-- Alternative link -->
        <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 6px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 8px 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <p style="font-size: 12px; color: rgba(0,0,0,0.8); word-break: break-all; margin: 0;">
                ${resetLink}
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }

    private static getWelcomeTemplate(
        clientName: string,
        email: string,
        temporaryPassword: string,
        loginLink: string
    ): string {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur votre espace client</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Bienvenue !</h1>
        </div>

        <!-- Content -->
        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour ${clientName},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Votre compte a été créé avec succès ! Vous pouvez maintenant accéder à votre espace client pour consulter vos documents, suivre votre programme de fidélité et gérer votre profil.
            </p>

            <!-- Credentials Box -->
            <div style="background-color: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 6px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 12px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    Vos identifiants de connexion
                </p>
                <div style="margin-bottom: 12px;">
                    <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 4px 0;">Email</p>
                    <p style="font-size: 14px; color: #000000; font-weight: 500; margin: 0;">${email}</p>
                </div>
                <div>
                    <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 4px 0;">Mot de passe temporaire</p>
                    <p style="font-size: 14px; color: #000000; font-weight: 500; font-family: 'Courier New', monospace; margin: 0;">${temporaryPassword}</p>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${loginLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Accéder à mon espace client
                </a>
            </div>

            <div style="background-color: rgba(0,0,0,0.03); border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="font-size: 13px; line-height: 1.6; color: rgba(0,0,0,0.6); margin: 0;">
                    ℹ️ <strong>Important :</strong> Nous vous recommandons de changer votre mot de passe dès votre première connexion pour des raisons de sécurité.
                </p>
            </div>
        </div>

        <!-- Alternative link -->
        <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 6px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 8px 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <p style="font-size: 12px; color: rgba(0,0,0,0.8); word-break: break-all; margin: 0;">
                ${loginLink}
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }
}
