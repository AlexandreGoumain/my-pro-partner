/**
 * Utility functions for payment processing
 */

import type { Payment, PaymentSummary } from "@/lib/types/payment.types";

/**
 * Convert euros to cents for Stripe
 * Stripe uses the smallest currency unit (cents for EUR)
 *
 * @param amount Amount in euros
 * @returns Amount in cents
 */
export function eurosToCents(amount: number): number {
    return Math.round(amount * 100);
}

/**
 * Convert cents to euros from Stripe
 *
 * @param cents Amount in cents
 * @returns Amount in euros
 */
export function centsToEuros(cents: number): number {
    return cents / 100;
}

/**
 * Format currency amount for display
 *
 * @param amount Amount to format
 * @param currency Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "EUR"): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Calculate payment summary from payment list
 *
 * @param payments List of payments
 * @param totalAmount Total amount of the document
 * @returns Payment summary
 */
export function calculatePaymentSummary(
    payments: Payment[],
    totalAmount: number
): PaymentSummary {
    const totalPaid = payments.reduce(
        (sum, payment) => sum + Number(payment.montant || 0),
        0
    );

    const sortedPayments = [...payments].sort(
        (a, b) =>
            new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime()
    );

    return {
        totalPaid: Math.round(totalPaid * 100) / 100,
        remainingAmount: Math.round((totalAmount - totalPaid) * 100) / 100,
        paymentCount: payments.length,
        lastPaymentDate: sortedPayments[0]?.date_paiement || null,
    };
}

/**
 * Check if a document is fully paid
 *
 * @param totalAmount Total amount of the document
 * @param paidAmount Amount already paid
 * @returns True if fully paid
 */
export function isFullyPaid(totalAmount: number, paidAmount: number): boolean {
    return paidAmount >= totalAmount;
}

/**
 * Calculate remaining amount with precision
 *
 * @param totalAmount Total amount
 * @param paidAmount Amount paid
 * @returns Remaining amount (0 if fully paid or overpaid)
 */
export function calculateRemainingAmount(
    totalAmount: number,
    paidAmount: number
): number {
    const remaining = totalAmount - paidAmount;
    return Math.max(0, Math.round(remaining * 100) / 100);
}

/**
 * Validate payment amount
 *
 * @param amount Payment amount
 * @param remainingAmount Remaining amount on the document
 * @returns Validation result
 */
export function validatePaymentAmount(
    amount: number,
    remainingAmount: number
): { valid: boolean; error?: string } {
    if (amount <= 0) {
        return { valid: false, error: "Le montant doit être supérieur à zéro" };
    }

    if (amount > remainingAmount) {
        return {
            valid: false,
            error: `Le montant ne peut pas dépasser le reste à payer (${formatCurrency(remainingAmount)})`,
        };
    }

    return { valid: true };
}

/**
 * Safe number conversion from Prisma Decimal
 * Handles string, number, and Decimal types
 *
 * @param value Value to convert
 * @param defaultValue Default value if conversion fails
 * @returns Number value
 */
export function toNumber(value: unknown, defaultValue: number = 0): number {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}
