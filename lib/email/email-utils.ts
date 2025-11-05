/**
 * Email Utilities
 * Helper functions for email processing and template management
 */

/**
 * Replace variables in a template string
 * Supports {{variable}} syntax
 *
 * @example
 * replaceVariables("Hello {{nom}}", { nom: "John" }) => "Hello John"
 */
export function replaceVariables(
  template: string,
  variables: Record<string, unknown>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    // Support both {{variable}} and {variable} syntax
    const regex1 = new RegExp(`{{${key}}}`, 'g');
    const regex2 = new RegExp(`{${key}}`, 'g');

    const replacementValue = value !== null && value !== undefined ? String(value) : '';

    result = result.replace(regex1, replacementValue);
    result = result.replace(regex2, replacementValue);
  }

  return result;
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate multiple email addresses
 */
export function validateEmails(emails: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const email of emails) {
    if (isValidEmail(email)) {
      valid.push(email.trim());
    } else {
      invalid.push(email);
    }
  }

  return { valid, invalid };
}

/**
 * Format currency for emails
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for emails
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'long') {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('fr-FR').format(dateObj);
}

/**
 * Sanitize HTML content for emails
 * Removes potentially dangerous scripts and event handlers
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');

  // Remove javascript: protocol in href and src
  sanitized = sanitized.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  sanitized = sanitized.replace(/src="javascript:[^"]*"/gi, 'src=""');

  return sanitized;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate unsubscribe link
 */
export function generateUnsubscribeLink(clientId: string, entrepriseId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mypropartner.fr';
  return `${baseUrl}/unsubscribe?clientId=${clientId}&entrepriseId=${entrepriseId}`;
}

/**
 * Generate email tracking pixel URL
 */
export function generateTrackingPixel(emailId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mypropartner.fr';
  return `${baseUrl}/api/emails/track/${emailId}/open`;
}

/**
 * Wrap links for click tracking
 */
export function wrapLinksForTracking(html: string, emailId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mypropartner.fr';

  return html.replace(
    /href="([^"]*)"/g,
    (match, url) => {
      if (url.startsWith('#') || url.startsWith('mailto:')) {
        return match;
      }
      const trackingUrl = `${baseUrl}/api/emails/track/${emailId}/click?url=${encodeURIComponent(url)}`;
      return `href="${trackingUrl}"`;
    }
  );
}

/**
 * Get common email variables for a client
 */
export function getClientVariables(client: {
  nom?: string | null;
  prenom?: string | null;
  email: string;
  telephone?: string | null;
  entreprise?: string | null;
}): Record<string, string> {
  return {
    nom: client.nom || '',
    prenom: client.prenom || '',
    email: client.email,
    telephone: client.telephone || '',
    entreprise: client.entreprise || '',
    nomComplet: [client.prenom, client.nom].filter(Boolean).join(' ') || 'Client',
  };
}

/**
 * Get common email variables for a document
 */
export function getDocumentVariables(document: {
  numero: string;
  type: string;
  total: number;
  dateEmission: Date | string;
  dateEcheance?: Date | string | null;
}): Record<string, string> {
  return {
    numeroDocument: document.numero,
    typeDocument: document.type === 'FACTURE' ? 'Facture' : document.type === 'DEVIS' ? 'Devis' : 'Avoir',
    montantTotal: formatCurrency(document.total),
    dateEmission: formatDate(document.dateEmission),
    dateEcheance: document.dateEcheance ? formatDate(document.dateEcheance) : '',
  };
}

/**
 * Create email subject with dynamic variables
 */
export function createSubject(template: string, variables: Record<string, unknown>): string {
  return replaceVariables(template, variables);
}

/**
 * Batch emails into groups to avoid rate limiting
 */
export function batchEmails<T>(items: T[], batchSize: number = 50): T[][] {
  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  return batches;
}

/**
 * Extract first name from full name
 */
export function extractFirstName(fullName: string): string {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Bonjour';
  } else if (hour < 18) {
    return 'Bon après-midi';
  } else {
    return 'Bonsoir';
  }
}
