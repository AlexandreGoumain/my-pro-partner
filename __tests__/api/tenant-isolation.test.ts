/**
 * Multi-Tenant Isolation Security Tests
 *
 * CRITICAL: These tests verify that users from one entreprise
 * cannot access resources belonging to another entreprise.
 *
 * This is the most important security feature of the application.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    createMockUser,
    createMockEntreprise,
    createMockContext,
    createMockClient,
    createMockDocument,
    createSecondMockEntreprise,
    createSecondMockUser,
    generateTestUUID,
} from './test-utils';

// Mock modules before tests
// Mock the auth route first to prevent NextAuth import issues
vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}));

vi.mock('next-auth', () => ({
    default: vi.fn(() => vi.fn()), // NextAuth default export
    getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        client: { findMany: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn() },
        document: { findMany: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn() },
        entreprise: { update: vi.fn() },
    },
}));

vi.mock('@/lib/dashboard-enabled', () => ({
    isDashboardEnabled: vi.fn().mockReturnValue(true),
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import {
    requireTenantAuth,
    validateTenantAccess,
    verifyResourceAccess,
    TenantError,
} from '@/lib/middleware/tenant-isolation';

// ============================================================================
// requireTenantAuth Tests
// ============================================================================

describe('requireTenantAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('throws error when session is missing', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        await expect(requireTenantAuth()).rejects.toThrow(TenantError);
        await expect(requireTenantAuth()).rejects.toThrow('Non autorisé');
    });

    it('throws error when session has no email', async () => {
        vi.mocked(getServerSession).mockResolvedValue({ user: {} });

        await expect(requireTenantAuth()).rejects.toThrow(TenantError);
    });

    it('throws error when user not found in database', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'unknown@test.fr' },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

        await expect(requireTenantAuth()).rejects.toThrow('Utilisateur introuvable');
    });

    it('throws error when user account is deleted', async () => {
        const user = createMockUser({ status: 'DELETED' });
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        await expect(requireTenantAuth()).rejects.toThrow('Compte utilisateur supprimé');
    });

    it('throws error when user has no entreprise', async () => {
        const user = createMockUser();
        // @ts-expect-error - testing null entreprise
        user.entreprise = null;
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        await expect(requireTenantAuth()).rejects.toThrow('Entreprise introuvable');
    });

    it('throws error when subscription is inactive', async () => {
        const entreprise = createMockEntreprise({ abonnementActif: false });
        const user = createMockUser({ entreprise });
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        await expect(requireTenantAuth()).rejects.toThrow('Abonnement expiré');
    });

    it('throws error and deactivates when subscription is expired', async () => {
        const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
        const entreprise = createMockEntreprise({
            abonnementActif: true,
            dateExpiration: expiredDate,
        });
        const user = createMockUser({ entreprise });
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);
        vi.mocked(prisma.entreprise.update).mockResolvedValue({} as never);

        await expect(requireTenantAuth()).rejects.toThrow('Abonnement expiré');

        // Verify that subscription was deactivated
        expect(prisma.entreprise.update).toHaveBeenCalledWith({
            where: { id: entreprise.id },
            data: { abonnementActif: false },
        });
    });

    it('returns valid context for authenticated user', async () => {
        const user = createMockUser();
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        const context = await requireTenantAuth();

        expect(context).toEqual({
            userId: user.id,
            entrepriseId: user.entrepriseId,
            entreprise: user.entreprise,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    });
});

// ============================================================================
// validateTenantAccess Tests
// ============================================================================

describe('validateTenantAccess', () => {
    it('allows access when entreprise IDs match', () => {
        const entrepriseId = 'entreprise-1';

        // Should not throw
        expect(() => validateTenantAccess(entrepriseId, entrepriseId)).not.toThrow();
    });

    it('throws error when entreprise IDs do not match', () => {
        const resourceEntrepriseId = 'entreprise-1';
        const userEntrepriseId = 'entreprise-2';

        expect(() => validateTenantAccess(resourceEntrepriseId, userEntrepriseId)).toThrow(
            TenantError
        );
        expect(() => validateTenantAccess(resourceEntrepriseId, userEntrepriseId)).toThrow(
            "Accès refusé - Cette ressource n'appartient pas à votre entreprise"
        );
    });

    it('throws 403 status code for unauthorized access', () => {
        try {
            validateTenantAccess('entreprise-1', 'entreprise-2');
            expect.fail('Should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(TenantError);
            expect((error as TenantError).statusCode).toBe(403);
        }
    });
});

// ============================================================================
// verifyResourceAccess Tests
// ============================================================================

describe('verifyResourceAccess', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('allows access to resource owned by same entreprise', async () => {
        const user = createMockUser();
        const client = createMockClient(user.entrepriseId);

        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        const fetchResource = vi.fn().mockResolvedValue(client);

        const { resource, context } = await verifyResourceAccess(
            client.id,
            fetchResource,
            'Client'
        );

        expect(resource).toEqual(client);
        expect(context.entrepriseId).toBe(user.entrepriseId);
    });

    it('throws error when resource not found', async () => {
        const user = createMockUser();

        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        const fetchResource = vi.fn().mockResolvedValue(null);

        await expect(
            verifyResourceAccess('non-existent-id', fetchResource, 'Client')
        ).rejects.toThrow('Client non trouvé');
    });

    it('blocks access to resource owned by different entreprise', async () => {
        const user = createMockUser();
        const otherEntreprise = createSecondMockEntreprise();
        const otherClient = createMockClient(otherEntreprise.id);

        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: user.email },
        });
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

        const fetchResource = vi.fn().mockResolvedValue(otherClient);

        await expect(
            verifyResourceAccess(otherClient.id, fetchResource, 'Client')
        ).rejects.toThrow("Accès refusé - Cette ressource n'appartient pas à votre entreprise");
    });
});

// ============================================================================
// Cross-Tenant Security Scenarios
// ============================================================================

describe('Cross-Tenant Security Scenarios', () => {
    const user1 = createMockUser();
    const user2 = createSecondMockUser();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Client Access', () => {
        it('User 1 can access their own clients', async () => {
            const client = createMockClient(user1.entrepriseId);

            vi.mocked(getServerSession).mockResolvedValue({
                user: { email: user1.email },
            });
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user1 as never);

            const fetchResource = vi.fn().mockResolvedValue(client);

            const { resource } = await verifyResourceAccess(
                client.id,
                fetchResource,
                'Client'
            );

            expect(resource.id).toBe(client.id);
        });

        it('User 1 CANNOT access clients from User 2 entreprise', async () => {
            const clientFromUser2 = createMockClient(user2.entrepriseId, {
                id: 'client-user2',
                nom: 'Client de User 2',
            });

            vi.mocked(getServerSession).mockResolvedValue({
                user: { email: user1.email },
            });
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user1 as never);

            const fetchResource = vi.fn().mockResolvedValue(clientFromUser2);

            await expect(
                verifyResourceAccess(clientFromUser2.id, fetchResource, 'Client')
            ).rejects.toThrow("Accès refusé");
        });

        it('User 2 CANNOT access clients from User 1 entreprise', async () => {
            const clientFromUser1 = createMockClient(user1.entrepriseId, {
                id: 'client-user1',
                nom: 'Client de User 1',
            });

            vi.mocked(getServerSession).mockResolvedValue({
                user: { email: user2.email },
            });
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user2 as never);

            const fetchResource = vi.fn().mockResolvedValue(clientFromUser1);

            await expect(
                verifyResourceAccess(clientFromUser1.id, fetchResource, 'Client')
            ).rejects.toThrow("Accès refusé");
        });
    });

    describe('Document Access', () => {
        it('User cannot access invoices from another entreprise', async () => {
            const clientOfUser2 = createMockClient(user2.entrepriseId);
            const invoiceOfUser2 = createMockDocument(
                user2.entrepriseId,
                clientOfUser2.id,
                { numero: 'FAC00001', type: 'FACTURE' }
            );

            vi.mocked(getServerSession).mockResolvedValue({
                user: { email: user1.email },
            });
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user1 as never);

            const fetchResource = vi.fn().mockResolvedValue(invoiceOfUser2);

            await expect(
                verifyResourceAccess(invoiceOfUser2.id, fetchResource, 'Facture')
            ).rejects.toThrow("Accès refusé");
        });

        it('User cannot access quotes from another entreprise', async () => {
            const clientOfUser2 = createMockClient(user2.entrepriseId);
            const quoteOfUser2 = createMockDocument(
                user2.entrepriseId,
                clientOfUser2.id,
                { numero: 'DEV00001', type: 'DEVIS' }
            );

            vi.mocked(getServerSession).mockResolvedValue({
                user: { email: user1.email },
            });
            vi.mocked(prisma.user.findUnique).mockResolvedValue(user1 as never);

            const fetchResource = vi.fn().mockResolvedValue(quoteOfUser2);

            await expect(
                verifyResourceAccess(quoteOfUser2.id, fetchResource, 'Devis')
            ).rejects.toThrow("Accès refusé");
        });
    });

    describe('Edge Cases', () => {
        it('Empty entrepriseId should be rejected', () => {
            expect(() => validateTenantAccess('', user1.entrepriseId)).toThrow();
            expect(() => validateTenantAccess(user1.entrepriseId, '')).toThrow();
        });

        it('Similar IDs should not match (substring attack)', () => {
            const fullId = 'entreprise-12345';
            const partialId = 'entreprise-1234';
            const prefixId = 'entreprise-123456';

            expect(() => validateTenantAccess(fullId, partialId)).toThrow();
            expect(() => validateTenantAccess(fullId, prefixId)).toThrow();
        });

        it('Case sensitivity - IDs should be case-sensitive', () => {
            const lowerId = 'entreprise-abc';
            const upperId = 'ENTREPRISE-ABC';
            const mixedId = 'Entreprise-Abc';

            expect(() => validateTenantAccess(lowerId, upperId)).toThrow();
            expect(() => validateTenantAccess(lowerId, mixedId)).toThrow();
        });

        it('Whitespace in IDs should be handled correctly', () => {
            const normalId = 'entreprise-1';
            const spacedId = ' entreprise-1';
            const trailingSpaceId = 'entreprise-1 ';

            expect(() => validateTenantAccess(normalId, spacedId)).toThrow();
            expect(() => validateTenantAccess(normalId, trailingSpaceId)).toThrow();
        });
    });
});

// ============================================================================
// SQL Injection Prevention (validateTenantAccess)
// ============================================================================

describe('SQL Injection Prevention', () => {
    it('rejects SQL injection in resource entrepriseId', () => {
        const maliciousId = "'; DROP TABLE users; --";
        const validId = 'entreprise-1';

        expect(() => validateTenantAccess(maliciousId, validId)).toThrow();
    });

    it('rejects SQL injection in user entrepriseId', () => {
        const validId = 'entreprise-1';
        const maliciousId = "1' OR '1'='1";

        expect(() => validateTenantAccess(validId, maliciousId)).toThrow();
    });

    it('rejects OR 1=1 attack', () => {
        const validId = 'entreprise-1';
        const maliciousId = "entreprise-1' OR 1=1--";

        expect(() => validateTenantAccess(validId, maliciousId)).toThrow();
    });
});

// ============================================================================
// UUID Validation
// ============================================================================

describe('UUID Format Validation', () => {
    it('validates proper UUID format', () => {
        const validUUID1 = '550e8400-e29b-41d4-a716-446655440000';
        const validUUID2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

        // Same valid UUIDs should pass
        expect(() => validateTenantAccess(validUUID1, validUUID1)).not.toThrow();
        expect(() => validateTenantAccess(validUUID2, validUUID2)).not.toThrow();
    });

    it('different UUIDs should not match', () => {
        const uuid1 = '550e8400-e29b-41d4-a716-446655440000';
        const uuid2 = '550e8400-e29b-41d4-a716-446655440001'; // Only last digit different

        expect(() => validateTenantAccess(uuid1, uuid2)).toThrow();
    });
});
