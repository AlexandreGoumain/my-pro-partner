/**
 * Validation schemas - Central exports
 *
 * This file re-exports all validation schemas from their respective modules
 * for backwards compatibility with existing imports from "@/lib/validation"
 */

// Auth schemas
export {
    acceptInvitationSchema,
    clientLoginSchema,
    clientRegisterSchema,
    forgotPasswordSchema,
    loginSchema,
    registerBackendSchema,
    registerSchema,
    resetPasswordSchema,
    type AcceptInvitationInput,
    type ClientLoginInput,
    type ClientRegisterInput,
    type ForgotPasswordInput,
    type LoginInput,
    type RegisterBackendInput,
    type RegisterInput,
    type ResetPasswordInput,
} from "./auth";

// Article schemas
export {
    articleBaseSchema,
    articleCreateSchema,
    articleUpdateSchema,
    pieceCreateSchema,
    type ArticleCreateInput,
    type ArticleUpdateInput,
    type PieceCreateInput,
} from "./articles";

// Stock schemas
export {
    mouvementStockBaseSchema,
    mouvementStockCreateSchema,
    stockAdjustmentSchema,
    type MouvementStockCreateInput,
    type StockAdjustmentInput,
} from "./stock";

// Client schemas
export {
    categorieBaseSchema,
    categorieCreateSchema,
    categorieUpdateSchema,
    champPersonnaliseBaseSchema,
    champPersonnaliseCreateSchema,
    champPersonnaliseUpdateSchema,
    clientBaseSchema,
    clientCreateSchema,
    clientUpdateSchema,
    type CategorieCreateInput,
    type CategorieUpdateInput,
    type ChampPersonnaliseCreateInput,
    type ChampPersonnaliseUpdateInput,
    type ClientCreateInput,
    type ClientUpdateInput,
} from "./clients";

// Loyalty schemas
export {
    mouvementPointsBaseSchema,
    mouvementPointsCreateSchema,
    niveauFideliteBaseSchema,
    niveauFideliteCreateSchema,
    niveauFideliteUpdateSchema,
    type MouvementPointsCreateInput,
    type NiveauFideliteCreateInput,
    type NiveauFideliteUpdateInput,
} from "./fidelite";

// Store schemas
export {
    paymentLinkBaseSchema,
    paymentLinkCreateSchema,
    paymentLinkUpdateSchema,
    storeBaseSchema,
    storeCreateSchema,
    storeUpdateSchema,
    terminalBaseSchema,
    terminalCreateSchema,
    terminalUpdateSchema,
    type PaymentLinkCreateInput,
    type PaymentLinkUpdateInput,
    type StoreCreateInput,
    type StoreUpdateInput,
    type TerminalCreateInput,
    type TerminalUpdateInput,
} from "./stores";

// Personnel schemas
export {
    automationBaseSchema,
    automationCreateSchema,
    automationUpdateSchema,
    employeeBaseSchema,
    employeeCreateSchema,
    employeeUpdateSchema,
    userBaseSchema,
    userCreateSchema,
    userUpdateSchema,
    type AutomationCreateInput,
    type AutomationUpdateInput,
    type EmployeeCreateInput,
    type EmployeeUpdateInput,
    type UserCreateInput,
    type UserUpdateInput,
} from "./personnel";

// Occasion schemas
export {
    demontageCreateSchema,
    rachatCreateSchema,
    ressourceUpdateSchema,
    ressourceUtiliserSchema,
    type DemontageCreateInput,
    type RachatCreateInput,
    type RessourceUpdateInput,
    type RessourceUtiliserInput,
} from "./occasion";

// Repair schemas
export {
    reparationAddPieceSchema,
    reparationAssignSchema,
    reparationCreateSchema,
    reparationDiagnosticSchema,
    reparationInterventionSchema,
    reparationStatusSchema,
    reparationUpdateSchema,
    type ReparationAddPieceInput,
    type ReparationAssignInput,
    type ReparationCreateInput,
    type ReparationDiagnosticInput,
    type ReparationInterventionInput,
    type ReparationStatusInput,
    type ReparationUpdateInput,
} from "./reparations";

// Fitness schemas
export {
    abonnementBaseSchema,
    abonnementCreateSchema,
    abonnementUpdateSchema,
    typeAbonnementBaseSchema,
    typeAbonnementCreateSchema,
    typeAbonnementUpdateSchema,
    type AbonnementCreateInput,
    type AbonnementUpdateInput,
    type TypeAbonnementCreateInput,
    type TypeAbonnementUpdateInput,
} from "./fitness";
