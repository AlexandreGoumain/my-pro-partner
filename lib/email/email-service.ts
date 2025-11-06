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
