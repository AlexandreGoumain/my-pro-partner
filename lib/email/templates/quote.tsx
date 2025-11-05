/**
 * Quote Email Template
 * Alias for InvoiceEmail with DEVIS type
 * Both invoices and quotes use the same template structure
 */

export { InvoiceEmail as QuoteEmail, type InvoiceEmailProps as QuoteEmailProps } from './invoice';
export { default } from './invoice';
