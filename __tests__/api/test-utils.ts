/**
 * API Test Utilities
 *
 * Helper functions for testing API routes with mocked authentication,
 * Prisma client, and tenant context.
 */

import { vi } from 'vitest';

// ============================================================================
// Types
// ============================================================================

export interface MockUser {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    entrepriseId: string;
    entreprise: MockEntreprise;
}

export interface MockEntreprise {
    id: string;
    nom: string;
    email: string;
    plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
    abonnementActif: boolean;
    dateExpiration: Date | null;
    businessType: string;
}

export interface MockTenantContext {
    userId: string;
    entrepriseId: string;
    entreprise: MockEntreprise;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
}

// ============================================================================
// Mock Data Factories
// ============================================================================

/**
 * Create a mock entreprise with default values
 */
export function createMockEntreprise(overrides: Partial<MockEntreprise> = {}): MockEntreprise {
    return {
        id: 'entreprise-1',
        nom: 'Test Entreprise',
        email: 'contact@test.fr',
        plan: 'PRO',
        abonnementActif: true,
        dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        businessType: 'INFORMATIQUE',
        ...overrides,
    };
}

/**
 * Create a mock user with default values
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
    const entreprise = createMockEntreprise(overrides.entreprise);
    return {
        id: 'user-1',
        email: 'user@test.fr',
        name: 'Test User',
        role: 'OWNER',
        status: 'ACTIVE',
        entrepriseId: entreprise.id,
        entreprise,
        ...overrides,
    };
}

/**
 * Create a mock tenant context from a user
 */
export function createMockContext(user: MockUser): MockTenantContext {
    return {
        userId: user.id,
        entrepriseId: user.entrepriseId,
        entreprise: user.entreprise,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    };
}

/**
 * Create a second mock entreprise for cross-tenant tests
 */
export function createSecondMockEntreprise(): MockEntreprise {
    return createMockEntreprise({
        id: 'entreprise-2',
        nom: 'Other Entreprise',
        email: 'other@test.fr',
    });
}

/**
 * Create a second mock user from a different entreprise
 */
export function createSecondMockUser(): MockUser {
    const entreprise = createSecondMockEntreprise();
    return createMockUser({
        id: 'user-2',
        email: 'other@test.fr',
        name: 'Other User',
        entrepriseId: entreprise.id,
        entreprise,
    });
}

// ============================================================================
// Mock Data - Clients
// ============================================================================

export interface MockClient {
    id: string;
    nom: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export function createMockClient(entrepriseId: string, overrides: Partial<MockClient> = {}): MockClient {
    return {
        id: `client-${Date.now()}`,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.fr',
        telephone: '0612345678',
        entrepriseId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

// ============================================================================
// Mock Data - Documents
// ============================================================================

export interface MockDocument {
    id: string;
    numero: string;
    type: 'DEVIS' | 'FACTURE' | 'AVOIR';
    clientId: string;
    entrepriseId: string;
    statut: string;
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    dateEmission: Date;
    createdAt: Date;
}

export function createMockDocument(
    entrepriseId: string,
    clientId: string,
    overrides: Partial<MockDocument> = {}
): MockDocument {
    return {
        id: `doc-${Date.now()}`,
        numero: 'FAC00001',
        type: 'FACTURE',
        clientId,
        entrepriseId,
        statut: 'BROUILLON',
        total_ht: 100,
        total_tva: 20,
        total_ttc: 120,
        dateEmission: new Date(),
        createdAt: new Date(),
        ...overrides,
    };
}

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Create a mock NextRequest with JSON body
 */
export function createMockRequest(
    url: string,
    options: {
        method?: string;
        body?: unknown;
        searchParams?: Record<string, string>;
    } = {}
): Request {
    const { method = 'GET', body, searchParams } = options;

    let fullUrl = url;
    if (searchParams) {
        const params = new URLSearchParams(searchParams);
        fullUrl = `${url}?${params.toString()}`;
    }

    const init: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        init.body = JSON.stringify(body);
    }

    return new Request(fullUrl, init);
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Assert that a response has a specific status code
 */
export function expectStatus(response: Response, status: number): void {
    if (response.status !== status) {
        throw new Error(`Expected status ${status}, got ${response.status}`);
    }
}

/**
 * Assert that a response body contains an error message
 */
export async function expectError(response: Response, messageIncludes: string): Promise<void> {
    const body = await response.json();
    if (!body.message?.includes(messageIncludes) && !body.error?.includes(messageIncludes)) {
        throw new Error(`Expected error containing "${messageIncludes}", got: ${JSON.stringify(body)}`);
    }
}

// ============================================================================
// UUID Helpers
// ============================================================================

/**
 * Generate a random UUID for testing
 */
export function generateTestUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ============================================================================
// Mock Setup Helpers
// ============================================================================

/**
 * Reset all mocks
 * Note: vi.mock() must be at the top level of test files, not inside functions
 * Use vi.mocked() to set up return values in beforeEach
 */
export function resetMocks(): void {
    vi.resetAllMocks();
}
