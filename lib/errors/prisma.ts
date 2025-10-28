// Prisma error codes
// https://www.prisma.io/docs/reference/api-reference/error-reference

export enum PrismaErrorCode {
  // Common errors
  RECORD_NOT_FOUND = "P2025",
  UNIQUE_CONSTRAINT_VIOLATION = "P2002",
  FOREIGN_KEY_CONSTRAINT_VIOLATION = "P2003",
  CONSTRAINT_VIOLATION = "P2004",
  INVALID_VALUE = "P2005",
  REQUIRED_FIELD_MISSING = "P2012",
  DEPENDENT_RECORDS_EXIST = "P2014",
  RELATION_VIOLATION = "P2015",
  QUERY_INTERPRETATION_ERROR = "P2016",
  CONNECTION_ERROR = "P1001",
  CONNECTION_TIMEOUT = "P1002",
}

export interface PrismaError {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

export function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export function isPrismaErrorCode(
  error: unknown,
  code: PrismaErrorCode
): boolean {
  return isPrismaError(error) && error.code === code;
}

export function getPrismaErrorMessage(error: unknown): string {
  if (!isPrismaError(error)) {
    return "Une erreur est survenue";
  }

  switch (error.code) {
    case PrismaErrorCode.RECORD_NOT_FOUND:
      return "L'enregistrement n'existe pas ou a été supprimé";
    case PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION:
      return "Cette valeur existe déjà dans la base de données";
    case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_VIOLATION:
      return "Impossible de créer ou modifier : référence invalide";
    case PrismaErrorCode.DEPENDENT_RECORDS_EXIST:
      return "Impossible de supprimer : des enregistrements dépendent de celui-ci";
    case PrismaErrorCode.CONNECTION_ERROR:
    case PrismaErrorCode.CONNECTION_TIMEOUT:
      return "Erreur de connexion à la base de données";
    default:
      return error.message || "Une erreur de base de données est survenue";
  }
}

export function handlePrismaError(error: unknown): {
  message: string;
  status: number;
} {
  if (!isPrismaError(error)) {
    return {
      message: "Erreur interne du serveur",
      status: 500,
    };
  }

  switch (error.code) {
    case PrismaErrorCode.RECORD_NOT_FOUND:
      return {
        message: getPrismaErrorMessage(error),
        status: 404,
      };
    case PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION:
    case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT_VIOLATION:
    case PrismaErrorCode.CONSTRAINT_VIOLATION:
    case PrismaErrorCode.REQUIRED_FIELD_MISSING:
      return {
        message: getPrismaErrorMessage(error),
        status: 400,
      };
    case PrismaErrorCode.DEPENDENT_RECORDS_EXIST:
      return {
        message: getPrismaErrorMessage(error),
        status: 409,
      };
    default:
      return {
        message: getPrismaErrorMessage(error),
        status: 500,
      };
  }
}
