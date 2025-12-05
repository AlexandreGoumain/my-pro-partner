// ==============================================
// TESTS DES CLASSES D'ERREUR - lib/errors/custom-errors.ts
// ==============================================
// Ce fichier montre comment tester des classes et leur comportement.
// Utile pour vérifier que les erreurs API retournent les bons codes HTTP.

import { describe, it, expect } from "vitest";
import {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    BusinessError,
    RateLimitError,
    ServiceUnavailableError,
} from "@/lib/errors";

// ==============================================
// Tests de la classe de base AppError
// ==============================================
describe("AppError", () => {
    it("crée une erreur avec message et status code", () => {
        const error = new AppError("Something went wrong", 500);

        expect(error.message).toBe("Something went wrong");
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe("AppError");
    });

    it("utilise 500 comme status code par défaut", () => {
        const error = new AppError("Error");
        expect(error.statusCode).toBe(500);
    });

    it("accepte un code optionnel", () => {
        const error = new AppError("Error", 500, "CUSTOM_CODE");
        expect(error.code).toBe("CUSTOM_CODE");
    });

    it("étend Error natif", () => {
        const error = new AppError("Error");
        // toBeInstanceOf() = Vérifie le type d'un objet
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
    });
});

// ==============================================
// Tests de ValidationError
// ==============================================
describe("ValidationError", () => {
    it("a le status code 400", () => {
        const error = new ValidationError("Invalid input");
        expect(error.statusCode).toBe(400);
        expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("accepte des erreurs de champs", () => {
        const errors = { email: ["Email invalide"], nom: ["Nom requis"] };
        const error = new ValidationError("Validation failed", errors);

        expect(error.errors).toEqual(errors);
    });
});

// ==============================================
// Tests de NotFoundError
// ==============================================
describe("NotFoundError", () => {
    it("a le status code 404", () => {
        const error = new NotFoundError("Client");
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe("NOT_FOUND");
    });

    it("formate le message sans ID", () => {
        const error = new NotFoundError("Client");
        expect(error.message).toBe("Client non trouvé");
    });

    it("formate le message avec ID", () => {
        const error = new NotFoundError("Client", "123");
        expect(error.message).toBe("Client avec l'ID 123 non trouvé");
    });

    it("expose le nom de la ressource", () => {
        const error = new NotFoundError("Article", "456");
        expect(error.resource).toBe("Article");
        expect(error.id).toBe("456");
    });
});

// ==============================================
// Tests de UnauthorizedError
// ==============================================
describe("UnauthorizedError", () => {
    it("a le status code 401", () => {
        const error = new UnauthorizedError();
        expect(error.statusCode).toBe(401);
        expect(error.code).toBe("UNAUTHORIZED");
    });

    it("a un message par défaut", () => {
        const error = new UnauthorizedError();
        expect(error.message).toBe("Non autorisé");
    });

    it("accepte un message personnalisé", () => {
        const error = new UnauthorizedError("Token expiré");
        expect(error.message).toBe("Token expiré");
    });
});

// ==============================================
// Tests de ForbiddenError
// ==============================================
describe("ForbiddenError", () => {
    it("a le status code 403", () => {
        const error = new ForbiddenError();
        expect(error.statusCode).toBe(403);
        expect(error.code).toBe("FORBIDDEN");
    });

    it("a un message par défaut", () => {
        const error = new ForbiddenError();
        expect(error.message).toBe("Accès refusé");
    });
});

// ==============================================
// Tests de ConflictError
// ==============================================
describe("ConflictError", () => {
    it("a le status code 409", () => {
        const error = new ConflictError("Email déjà utilisé");
        expect(error.statusCode).toBe(409);
        expect(error.code).toBe("CONFLICT");
    });
});

// ==============================================
// Tests de BusinessError
// ==============================================
describe("BusinessError", () => {
    it("a le status code 422", () => {
        const error = new BusinessError("Stock insuffisant");
        expect(error.statusCode).toBe(422);
        expect(error.code).toBe("BUSINESS_ERROR");
    });
});

// ==============================================
// Tests de RateLimitError
// ==============================================
describe("RateLimitError", () => {
    it("a le status code 429", () => {
        const error = new RateLimitError();
        expect(error.statusCode).toBe(429);
        expect(error.code).toBe("RATE_LIMIT");
    });

    it("a un message par défaut", () => {
        const error = new RateLimitError();
        expect(error.message).toBe("Trop de requêtes, veuillez réessayer plus tard");
    });

    it("accepte un retryAfter", () => {
        const error = new RateLimitError("Wait", 60);
        expect(error.retryAfter).toBe(60);
    });
});

// ==============================================
// Tests de ServiceUnavailableError
// ==============================================
describe("ServiceUnavailableError", () => {
    it("a le status code 503", () => {
        const error = new ServiceUnavailableError();
        expect(error.statusCode).toBe(503);
        expect(error.code).toBe("SERVICE_UNAVAILABLE");
    });
});
