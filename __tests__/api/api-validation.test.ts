/**
 * API Input Validation Tests
 *
 * Tests for validating API input schemas to ensure:
 * - Required fields are enforced
 * - Invalid data types are rejected
 * - Security-sensitive inputs are sanitized
 * - Business rules are enforced
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
    clientCreateSchema,
    clientUpdateSchema,
} from '@/lib/validation';

// ============================================================================
// Document Line Schema (inline definition for testing)
// ============================================================================

const lineItemSchema = z.object({
    ordre: z.number(),
    articleId: z.string().optional().nullable(),
    designation: z.string().min(1),
    description: z.string().optional().nullable(),
    quantite: z.number().positive(),
    prix_unitaire_ht: z.number().min(0),
    tva_taux: z.number().min(0).max(100),
    remise_pourcent: z.number().min(0).max(100).default(0),
    montant_ht: z.number(),
    montant_tva: z.number(),
    montant_ttc: z.number(),
});

const documentSchema = z.object({
    type: z.enum(['DEVIS', 'FACTURE', 'AVOIR']),
    clientId: z.string().min(1, 'Client requis'),
    dateEmission: z.coerce.date(),
    dateEcheance: z.coerce.date().optional().nullable(),
    statut: z
        .enum(['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'PAYE', 'ANNULE'])
        .default('BROUILLON'),
    notes: z.string().optional().nullable(),
    conditions_paiement: z.string().optional().nullable(),
    validite_jours: z.number().default(30),
    total_ht: z.number(),
    total_tva: z.number(),
    total_ttc: z.number(),
    acompte_montant: z.number().default(0),
    lignes: z.array(lineItemSchema).min(1, 'Au moins une ligne requise'),
});

// ============================================================================
// Client Validation Tests
// ============================================================================

describe('Client Validation Schema', () => {
    describe('Create Client', () => {
        it('accepts valid client with required fields only', () => {
            const result = clientCreateSchema.safeParse({
                nom: 'Dupont',
            });
            expect(result.success).toBe(true);
        });

        it('accepts valid client with all fields', () => {
            const result = clientCreateSchema.safeParse({
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@email.fr',
                telephone: '0612345678',
                adresse: '123 rue de Paris',
                codePostal: '75001',
                ville: 'Paris',
                pays: 'France',
            });
            expect(result.success).toBe(true);
        });

        it('rejects client without nom', () => {
            const result = clientCreateSchema.safeParse({
                prenom: 'Jean',
                email: 'jean@email.fr',
            });
            expect(result.success).toBe(false);
        });

        it('rejects empty nom', () => {
            const result = clientCreateSchema.safeParse({
                nom: '',
            });
            expect(result.success).toBe(false);
        });

        it('rejects invalid email format', () => {
            const result = clientCreateSchema.safeParse({
                nom: 'Dupont',
                email: 'not-an-email',
            });
            expect(result.success).toBe(false);
        });

        it('accepts empty email (optional field)', () => {
            const result = clientCreateSchema.safeParse({
                nom: 'Dupont',
                email: '',
            });
            // Empty string is coerced to undefined for optional email
            expect(result.success).toBe(true);
        });
    });

    describe('Update Client', () => {
        it('accepts partial update with only nom', () => {
            const result = clientUpdateSchema.safeParse({
                nom: 'Nouveau Nom',
            });
            expect(result.success).toBe(true);
        });

        it('accepts partial update with only email', () => {
            const result = clientUpdateSchema.safeParse({
                email: 'nouveau@email.fr',
            });
            expect(result.success).toBe(true);
        });

        it('rejects update with empty nom', () => {
            const result = clientUpdateSchema.safeParse({
                nom: '',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('Security - XSS Prevention', () => {
        it('should handle script tags in nom (sanitization depends on output)', () => {
            const result = clientCreateSchema.safeParse({
                nom: '<script>alert("xss")</script>',
            });
            // The schema accepts the string, but output should be escaped
            // This test documents current behavior
            expect(result.success).toBe(true);
            if (result.success) {
                // Data is stored as-is, frontend must escape
                expect(result.data.nom).toContain('script');
            }
        });

        it('should handle HTML entities in fields', () => {
            const result = clientCreateSchema.safeParse({
                nom: '&lt;test&gt;',
                adresse: '<div onclick="evil()">Click me</div>',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('Security - SQL Injection Prevention', () => {
        it('accepts SQL-like strings (parameterized queries prevent injection)', () => {
            const result = clientCreateSchema.safeParse({
                nom: "'; DROP TABLE clients; --",
            });
            // Schema accepts it - SQL injection is prevented by Prisma's parameterized queries
            expect(result.success).toBe(true);
        });

        it('accepts OR 1=1 patterns (safe with parameterized queries)', () => {
            const result = clientCreateSchema.safeParse({
                nom: "admin' OR '1'='1",
            });
            expect(result.success).toBe(true);
        });
    });
});

// ============================================================================
// Document Validation Tests
// ============================================================================

describe('Document Validation Schema', () => {
    const validLine = {
        ordre: 1,
        designation: 'Service de développement',
        quantite: 10,
        prix_unitaire_ht: 100,
        tva_taux: 20,
        remise_pourcent: 0,
        montant_ht: 1000,
        montant_tva: 200,
        montant_ttc: 1200,
    };

    const validDocument = {
        type: 'FACTURE' as const,
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        dateEmission: '2024-01-15',
        statut: 'BROUILLON' as const,
        total_ht: 1000,
        total_tva: 200,
        total_ttc: 1200,
        lignes: [validLine],
    };

    describe('Create Document', () => {
        it('accepts valid facture', () => {
            const result = documentSchema.safeParse(validDocument);
            expect(result.success).toBe(true);
        });

        it('accepts valid devis', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                type: 'DEVIS',
            });
            expect(result.success).toBe(true);
        });

        it('accepts valid avoir', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                type: 'AVOIR',
            });
            expect(result.success).toBe(true);
        });

        it('rejects invalid document type', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                type: 'BON_DE_COMMANDE',
            });
            expect(result.success).toBe(false);
        });

        it('rejects missing clientId', () => {
            const { clientId, ...docWithoutClient } = validDocument;
            const result = documentSchema.safeParse(docWithoutClient);
            expect(result.success).toBe(false);
        });

        it('rejects empty clientId', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                clientId: '',
            });
            expect(result.success).toBe(false);
        });

        it('rejects document without lines', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [],
            });
            expect(result.success).toBe(false);
        });
    });

    describe('Line Item Validation', () => {
        it('rejects negative quantity', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, quantite: -1 }],
            });
            expect(result.success).toBe(false);
        });

        it('rejects zero quantity', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, quantite: 0 }],
            });
            expect(result.success).toBe(false);
        });

        it('rejects negative price', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, prix_unitaire_ht: -100 }],
            });
            expect(result.success).toBe(false);
        });

        it('rejects TVA rate over 100%', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, tva_taux: 150 }],
            });
            expect(result.success).toBe(false);
        });

        it('rejects discount over 100%', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, remise_pourcent: 110 }],
            });
            expect(result.success).toBe(false);
        });

        it('rejects empty designation', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, designation: '' }],
            });
            expect(result.success).toBe(false);
        });

        it('accepts line with articleId', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{
                    ...validLine,
                    articleId: '550e8400-e29b-41d4-a716-446655440001',
                }],
            });
            expect(result.success).toBe(true);
        });

        it('accepts line without articleId (free text)', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                lignes: [{ ...validLine, articleId: null }],
            });
            expect(result.success).toBe(true);
        });
    });

    describe('Date Validation', () => {
        it('accepts valid date string', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                dateEmission: '2024-01-15',
            });
            expect(result.success).toBe(true);
        });

        it('accepts ISO date string', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                dateEmission: '2024-01-15T10:30:00.000Z',
            });
            expect(result.success).toBe(true);
        });

        it('rejects invalid date string', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                dateEmission: 'not-a-date',
            });
            expect(result.success).toBe(false);
        });

        it('accepts optional dateEcheance', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                dateEcheance: '2024-02-15',
            });
            expect(result.success).toBe(true);
        });

        it('accepts null dateEcheance', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                dateEcheance: null,
            });
            expect(result.success).toBe(true);
        });
    });

    describe('Status Transitions', () => {
        it('accepts all valid statuses', () => {
            const validStatuses = ['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'PAYE', 'ANNULE'];

            validStatuses.forEach(statut => {
                const result = documentSchema.safeParse({
                    ...validDocument,
                    statut,
                });
                expect(result.success).toBe(true);
            });
        });

        it('rejects invalid status', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                statut: 'EN_ATTENTE',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('Financial Validation', () => {
        it('accepts down payment (acompte)', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                acompte_montant: 500,
            });
            expect(result.success).toBe(true);
        });

        it('defaults acompte to 0', () => {
            const result = documentSchema.safeParse(validDocument);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.acompte_montant).toBe(0);
            }
        });

        it('accepts decimal amounts', () => {
            const result = documentSchema.safeParse({
                ...validDocument,
                total_ht: 1000.50,
                total_tva: 200.10,
                total_ttc: 1200.60,
            });
            expect(result.success).toBe(true);
        });
    });
});

// ============================================================================
// UUID Validation Tests
// ============================================================================

describe('UUID Validation', () => {
    const uuidSchema = z.string().uuid();

    it('accepts valid UUID v4', () => {
        const result = uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
        expect(result.success).toBe(true);
    });

    it('rejects invalid UUID format', () => {
        const invalidUUIDs = [
            'not-a-uuid',
            '550e8400-e29b-41d4-a716', // Too short
            '550e8400-e29b-41d4-a716-446655440000-extra', // Too long
            '550e8400e29b41d4a716446655440000', // Missing dashes
            '550e8400-e29b-41d4-a716-44665544000g', // Invalid character
        ];

        invalidUUIDs.forEach(uuid => {
            const result = uuidSchema.safeParse(uuid);
            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// Email Validation Tests
// ============================================================================

describe('Email Validation', () => {
    const emailSchema = z.string().email();

    it('accepts valid email formats', () => {
        const validEmails = [
            'test@example.com',
            'user.name@example.fr',
            'user+tag@example.com',
            'user@sub.domain.com',
        ];

        validEmails.forEach(email => {
            const result = emailSchema.safeParse(email);
            expect(result.success).toBe(true);
        });
    });

    it('rejects invalid email formats', () => {
        const invalidEmails = [
            'not-an-email',
            '@example.com',
            'user@',
            'user@.com',
            'user@example.',
            'user name@example.com',
        ];

        invalidEmails.forEach(email => {
            const result = emailSchema.safeParse(email);
            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// Phone Number Validation Tests
// ============================================================================

describe('Phone Number Validation', () => {
    // French phone number regex pattern
    const frenchPhoneSchema = z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/);

    it('accepts valid French phone numbers', () => {
        const validPhones = [
            '0612345678',
            '06 12 34 56 78',
            '06.12.34.56.78',
            '+33612345678',
            '+33 6 12 34 56 78',
        ];

        validPhones.forEach(phone => {
            const result = frenchPhoneSchema.safeParse(phone);
            expect(result.success).toBe(true);
        });
    });

    it('rejects invalid phone numbers', () => {
        const invalidPhones = [
            '123',
            '06123456789012', // Too long
            'not-a-phone',
            '+1234567890', // Non-French
        ];

        invalidPhones.forEach(phone => {
            const result = frenchPhoneSchema.safeParse(phone);
            expect(result.success).toBe(false);
        });
    });
});
