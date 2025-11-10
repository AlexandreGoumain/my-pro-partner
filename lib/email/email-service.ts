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
