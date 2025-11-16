import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email Service - Centralized email sending functionality
 * Uses Resend API for reliable email delivery
 */
export class EmailService {
  private defaultFrom: string;
  private defaultFromName: string;

  constructor() {
    this.defaultFrom = process.env.EMAIL_FROM || 'support@mypropartner.fr';
    this.defaultFromName = process.env.EMAIL_FROM_NAME || 'MyProPartner';
  }

  /**
   * Send a single email
   * Uses the entreprise name and email for better multi-tenant support
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      // Validate API key
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      // Validate recipient
      if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
        throw new Error('No recipient specified');
      }

      // Prepare sender
      // Format: "Entreprise Name <support@mypropartner.fr>"
      const fromName = options.fromName || this.defaultFromName;
      const fromEmail = this.defaultFrom; // Always use verified domain
      const from = `${fromName} <${fromEmail}>`;

      // Send email via Resend
      const result = await resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo, // Client will reply to this address
        attachments: options.attachments,
      });

      // Check for errors
      if ('error' in result && result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('[Email Service] Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send bulk emails (to multiple recipients)
   * Sends individual emails to maintain privacy
   */
  async sendBulkEmails(
    recipients: string[],
    subject: string,
    htmlTemplate: string,
    variables?: Record<string, unknown>[],
    fromName?: string,
    replyTo?: string
  ): Promise<{
    successCount: number;
    failureCount: number;
    results: SendEmailResult[];
  }> {
    const results: SendEmailResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      // Replace variables if provided
      let html = htmlTemplate;
      if (variables && variables[i]) {
        html = this.replaceVariables(htmlTemplate, variables[i]);
      }

      const result = await this.sendEmail({
        to: recipient,
        subject,
        html,
        fromName,
        replyTo,
      });

      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }

      // Add small delay to avoid rate limiting
      if (i < recipients.length - 1) {
        await this.delay(100);
      }
    }

    return {
      successCount,
      failureCount,
      results,
    };
  }

  /**
   * Replace variables in template
   * Variables format: {{variableName}}
   */
  private replaceVariables(template: string, variables: Record<string, unknown>): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value || ''));
    }

    return result;
  }

  /**
   * Utility: Add delay for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Send team member invitation email
   */
  async sendTeamInvitation(options: {
    to: string;
    inviteeName: string;
    inviterName: string;
    entrepriseName: string;
    role: string;
    invitationToken: string;
  }): Promise<SendEmailResult> {
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/team/accept-invitation?token=${options.invitationToken}`;

    const roleLabels: Record<string, string> = {
      OWNER: 'Propriétaire',
      ADMIN: 'Administrateur',
      MANAGER: 'Manager',
      EMPLOYEE: 'Employé',
      CASHIER: 'Caissier',
      ACCOUNTANT: 'Comptable',
    };

    const roleLabel = roleLabels[options.role] || 'Membre de l\'équipe';

    const html = this.getTeamInvitationTemplate(
      options.inviteeName,
      options.inviterName,
      options.entrepriseName,
      roleLabel,
      invitationLink
    );

    return this.sendEmail({
      to: options.to,
      subject: `Invitation à rejoindre ${options.entrepriseName}`,
      html,
      fromName: options.entrepriseName,
    });
  }

  /**
   * Team invitation email template (Apple-inspired design)
   */
  private getTeamInvitationTemplate(
    inviteeName: string,
    inviterName: string,
    entrepriseName: string,
    role: string,
    invitationLink: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à rejoindre l'équipe</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Invitation à rejoindre l'équipe</h1>
        </div>

        <!-- Content -->
        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour${inviteeName ? ' ' + inviteeName : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                <strong>${inviterName}</strong> vous invite à rejoindre <strong>${entrepriseName}</strong> sur MyProPartner en tant que <strong>${role}</strong>.
            </p>

            <!-- Info Box -->
            <div style="background-color: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 6px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 12px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    Détails de l'invitation
                </p>
                <div style="margin-bottom: 12px;">
                    <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 4px 0;">Entreprise</p>
                    <p style="font-size: 14px; color: #000000; font-weight: 500; margin: 0;">${entrepriseName}</p>
                </div>
                <div>
                    <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 4px 0;">Rôle</p>
                    <p style="font-size: 14px; color: #000000; font-weight: 500; margin: 0;">${role}</p>
                </div>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Pour accepter cette invitation et créer votre compte, cliquez sur le bouton ci-dessous :
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${invitationLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Accepter l'invitation
                </a>
            </div>

            <div style="background-color: rgba(0,0,0,0.03); border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="font-size: 13px; line-height: 1.6; color: rgba(0,0,0,0.6); margin: 0;">
                    ℹ️ <strong>Important :</strong> Cette invitation est valable pendant 7 jours. Vous pourrez définir votre propre mot de passe lors de l'acceptation.
                </p>
            </div>
        </div>

        <!-- Alternative link -->
        <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 6px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 8px 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <p style="font-size: 12px; color: rgba(0,0,0,0.8); word-break: break-all; margin: 0;">
                ${invitationLink}
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

  /**
   * Send client approval email
   */
  async sendClientApproval(options: {
    to: string;
    clientName: string;
    entrepriseName: string;
    loginUrl: string;
  }): Promise<SendEmailResult> {
    const html = this.getClientApprovalTemplate(
      options.clientName,
      options.entrepriseName,
      options.loginUrl
    );

    return this.sendEmail({
      to: options.to,
      subject: `Votre compte ${options.entrepriseName} a été activé`,
      html,
      fromName: options.entrepriseName,
    });
  }

  /**
   * Send client rejection email
   */
  async sendClientRejection(options: {
    to: string;
    clientName: string;
    entrepriseName: string;
    reason?: string;
  }): Promise<SendEmailResult> {
    const html = this.getClientRejectionTemplate(
      options.clientName,
      options.entrepriseName,
      options.reason
    );

    return this.sendEmail({
      to: options.to,
      subject: `Mise à jour de votre demande d'inscription`,
      html,
      fromName: options.entrepriseName,
    });
  }

  /**
   * Send client invitation email
   */
  async sendClientInvitation(options: {
    to: string;
    clientName?: string;
    entrepriseName: string;
    invitationToken: string;
  }): Promise<SendEmailResult> {
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/auth/accept-invitation?token=${options.invitationToken}`;

    const html = this.getClientInvitationTemplate(
      options.clientName,
      options.entrepriseName,
      invitationLink
    );

    return this.sendEmail({
      to: options.to,
      subject: `Invitation à rejoindre ${options.entrepriseName}`,
      html,
      fromName: options.entrepriseName,
    });
  }

  /**
   * Send client welcome email
   */
  async sendClientWelcome(options: {
    to: string;
    clientName: string;
    entrepriseName: string;
    loginUrl: string;
  }): Promise<SendEmailResult> {
    const html = this.getClientWelcomeTemplate(
      options.clientName,
      options.entrepriseName,
      options.loginUrl
    );

    return this.sendEmail({
      to: options.to,
      subject: `Bienvenue chez ${options.entrepriseName}`,
      html,
      fromName: options.entrepriseName,
    });
  }

  /**
   * Client approval email template
   */
  private getClientApprovalTemplate(clientName: string, entrepriseName: string, loginUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compte activé</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Votre compte a été activé ✓</h1>
        </div>

        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour${clientName ? ' ' + clientName : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Bonne nouvelle ! Votre compte client chez <strong>${entrepriseName}</strong> a été approuvé et activé.
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Vous pouvez maintenant vous connecter à votre espace client pour :
            </p>

            <ul style="font-size: 15px; line-height: 1.8; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                <li>Consulter vos documents (devis, factures)</li>
                <li>Suivre vos points de fidélité</li>
                <li>Gérer vos informations personnelles</li>
            </ul>

            <div style="text-align: center; margin: 32px 0;">
                <a href="${loginUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Accéder à mon espace client
                </a>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Merci de votre confiance !
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Client rejection email template
   */
  private getClientRejectionTemplate(clientName: string, entrepriseName: string, reason?: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre demande</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Mise à jour de votre demande</h1>
        </div>

        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour${clientName ? ' ' + clientName : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Nous avons examiné votre demande d'inscription chez <strong>${entrepriseName}</strong>.
            </p>

            ${reason ? `
            <div style="background-color: rgba(0,0,0,0.03); border-radius: 6px; padding: 16px; margin: 24px 0;">
                <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 8px 0; font-weight: 500;">MOTIF</p>
                <p style="font-size: 14px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0;">
                    ${reason}
                </p>
            </div>
            ` : ''}

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0;">
                Pour toute question, n'hésitez pas à nous contacter directement.
            </p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Cordialement, l'équipe ${entrepriseName}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Client invitation email template
   */
  private getClientInvitationTemplate(clientName: string | undefined, entrepriseName: string, invitationLink: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation client</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Invitation à rejoindre notre espace client</h1>
        </div>

        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour${clientName ? ' ' + clientName : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                <strong>${entrepriseName}</strong> vous invite à créer votre espace client pour profiter de nombreux avantages :
            </p>

            <ul style="font-size: 15px; line-height: 1.8; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                <li>Accédez à vos documents en ligne</li>
                <li>Suivez votre programme de fidélité</li>
                <li>Consultez votre historique</li>
            </ul>

            <div style="text-align: center; margin: 32px 0;">
                <a href="${invitationLink}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Créer mon compte
                </a>
            </div>

            <div style="background-color: rgba(0,0,0,0.03); border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="font-size: 13px; line-height: 1.6; color: rgba(0,0,0,0.6); margin: 0;">
                    ℹ️ Cette invitation est valable pendant 7 jours.
                </p>
            </div>
        </div>

        <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 6px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.5); margin: 0 0 8px 0;">
                Si le bouton ne fonctionne pas, copiez ce lien :
            </p>
            <p style="font-size: 12px; color: rgba(0,0,0,0.8); word-break: break-all; margin: 0;">
                ${invitationLink}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Client welcome email template
   */
  private getClientWelcomeTemplate(clientName: string, entrepriseName: string, loginUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Bienvenue ! 👋</h1>
        </div>

        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour${clientName ? ' ' + clientName : ''},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Bienvenue chez <strong>${entrepriseName}</strong> ! Votre compte client a été créé avec succès.
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Votre espace client vous permet de :
            </p>

            <ul style="font-size: 15px; line-height: 1.8; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                <li>Consulter vos devis et factures</li>
                <li>Suivre vos points de fidélité et avantages</li>
                <li>Gérer vos informations personnelles</li>
                <li>Accéder à votre historique complet</li>
            </ul>

            <div style="text-align: center; margin: 32px 0;">
                <a href="${loginUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 500;">
                    Accéder à mon espace
                </a>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Merci de votre confiance !
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Validate email address format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize email content to prevent XSS
   */
  static sanitizeHtml(html: string): string {
    // Basic sanitization - in production, consider using a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '');
  }
}

// Export singleton instance
export const emailService = new EmailService();
