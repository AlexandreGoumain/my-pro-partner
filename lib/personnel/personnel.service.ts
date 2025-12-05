/**
 * Service de gestion du personnel
 *
 * Gère toutes les opérations liées aux employés :
 * - CRUD des utilisateurs
 * - Gestion des permissions
 * - Invitations
 * - Horaires de travail
 * - Suivi du temps (time tracking)
 * - Audit des activités
 */

import { emailService } from "@/lib/email/email-service";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getDefaultPermissions, UserRole, UserStatus } from "./roles-config";

// ============================================
// CONSTANTES
// ============================================

const BCRYPT_SALT_ROUNDS = 10;
const INVITATION_EXPIRY_DAYS = 7;
const TOKEN_LENGTH = 32;
const PASSWORD_LENGTH = 12;
const PASSWORD_CHARS =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

const USER_STATUS = {
    DELETED: "DELETED" as UserStatus,
    INVITED: "INVITED" as UserStatus,
    ACTIVE: "ACTIVE" as UserStatus,
} as const;

const USER_ROLES = {
    OWNER: "OWNER" as UserRole,
    EMPLOYEE: "EMPLOYEE" as UserRole,
} as const;

const TIME_ENTRY_TYPE = {
    REGULAR: "REGULAR",
} as const;

const DEFAULT_INVITER_NAME = "L'équipe";
const DEFAULT_ENTREPRISE_NAME = "Votre entreprise";

const ERROR_MESSAGES = {
    EMAIL_ALREADY_USED: "Cet email est déjà utilisé",
    USER_NOT_FOUND: "Utilisateur introuvable",
    CANNOT_DELETE_OWNER:
        "Impossible de supprimer le propriétaire de l'entreprise",
    ALREADY_CLOCKED_IN:
        "Vous êtes déjà pointé. Veuillez pointer votre sortie d'abord.",
    NO_CLOCK_IN_FOUND: "Aucun pointage en cours trouvé",
} as const;

const DEFAULT_ACTIVITY_LIMITS = {
    USER: 50,
    COMPANY: 100,
} as const;

// Conversion constantes
const MS_PER_MINUTE = 1000 * 60;

// ============================================
// TYPES
// ============================================

export interface CreateUserInput {
    email: string;
    name?: string;
    prenom?: string;
    role: UserRole;
    password?: string; // Optionnel si invitation
    telephone?: string;
    poste?: string;
    departement?: string;
    dateEmbauche?: Date;
    salaireHoraire?: number;
    sendInvitation?: boolean; // Envoyer email d'invitation
}

export interface UpdateUserInput {
    name?: string;
    prenom?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    telephone?: string;
    dateNaissance?: Date;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    photoUrl?: string;
    poste?: string;
    departement?: string;
    dateEmbauche?: Date;
    dateFinContrat?: Date;
    salaireHoraire?: number;
    numeroSecu?: string;
    iban?: string;
}

export interface UserWithPermissions {
    id: string;
    email: string;
    name?: string | null;
    prenom?: string | null;
    role: UserRole;
    status: UserStatus;
    telephone?: string | null;
    poste?: string | null;
    departement?: string | null;
    dateEmbauche?: Date | null;
    photoUrl?: string | null;
    lastLoginAt?: Date | null;
    permissions?: Record<string, boolean>;
    createdAt: Date;
}

// ============================================
// GESTION DES UTILISATEURS
// ============================================

/**
 * Créer un nouvel utilisateur/employé
 */
export async function createUser(
    entrepriseId: string,
    data: CreateUserInput,
    createdByUserId?: string
) {
    // Vérifier que l'email n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_USED);
    }

    // Générer un mot de passe temporaire si non fourni
    const tempPassword = data.password || generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, BCRYPT_SALT_ROUNDS);

    // Déterminer le statut initial
    const status: UserStatus = data.sendInvitation
        ? USER_STATUS.INVITED
        : USER_STATUS.ACTIVE;

    // Créer l'utilisateur
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            prenom: data.prenom,
            role: data.role,
            status,
            telephone: data.telephone,
            poste: data.poste,
            departement: data.departement,
            dateEmbauche: data.dateEmbauche,
            salaireHoraire: data.salaireHoraire,
            entrepriseId,
        },
        include: {
            permissions: true,
        },
    });

    // Créer les permissions par défaut pour ce rôle
    await createDefaultPermissions(user.id, data.role);

    // Logger l'activité
    if (createdByUserId) {
        await logUserActivity({
            userId: createdByUserId,
            action: "CREATE",
            resource: "User",
            resourceId: user.id,
            details: { role: data.role, email: data.email },
        });
    }

    // Envoyer l'email d'invitation si sendInvitation = true
    if (data.sendInvitation && createdByUserId) {
        try {
            await sendUserInvitation(
                entrepriseId,
                data.email,
                data.name,
                data.prenom,
                data.role,
                createdByUserId
            );
        } catch (_error) {
            // Ne pas échouer la création si l'email échoue
        }
    }

    return user;
}

/**
 * Récupérer tous les utilisateurs d'une entreprise (exclut les utilisateurs supprimés)
 */
export async function getUsers(
    entrepriseId: string,
    filters?: {
        role?: UserRole;
        status?: UserStatus;
        search?: string;
        includeDeleted?: boolean; // Pour inclure les utilisateurs supprimés si nécessaire
    }
) {
    const where: Record<string, unknown> = {
        entrepriseId,
    };

    // Exclure les utilisateurs supprimés par défaut
    if (!filters?.includeDeleted) {
        where.status = { not: USER_STATUS.DELETED };
    }

    if (filters?.role) {
        where.role = filters.role;
    }

    if (filters?.status) {
        // Si un status spécifique est demandé, l'utiliser
        where.status = filters.status;
    }

    if (filters?.search) {
        where.OR = [
            { email: { contains: filters.search, mode: "insensitive" } },
            { name: { contains: filters.search, mode: "insensitive" } },
            { prenom: { contains: filters.search, mode: "insensitive" } },
        ];
    }

    const users = await prisma.user.findMany({
        where,
        include: {
            permissions: true,
        },
        orderBy: [
            { status: "asc" }, // ACTIVE en premier
            { createdAt: "desc" },
        ],
    });

    return users;
}

/**
 * Récupérer un utilisateur par ID
 */
export async function getUserById(userId: string, entrepriseId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
            entrepriseId,
        },
        include: {
            permissions: true,
            schedules: {
                orderBy: { dayOfWeek: "asc" },
            },
        },
    });

    if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
}

/**
 * Mettre à jour un utilisateur
 */
export async function updateUser(
    userId: string,
    entrepriseId: string,
    data: UpdateUserInput,
    updatedByUserId?: string
) {
    // Vérifier que l'utilisateur existe
    const existingUser = await getUserById(userId, entrepriseId);

    // Si l'email change, vérifier qu'il n'est pas déjà utilisé
    if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (emailExists) {
            throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_USED);
        }
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            prenom: data.prenom,
            email: data.email,
            role: data.role,
            status: data.status,
            telephone: data.telephone,
            dateNaissance: data.dateNaissance,
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
            photoUrl: data.photoUrl,
            poste: data.poste,
            departement: data.departement,
            dateEmbauche: data.dateEmbauche,
            dateFinContrat: data.dateFinContrat,
            salaireHoraire: data.salaireHoraire,
            numeroSecu: data.numeroSecu,
            iban: data.iban,
        },
        include: {
            permissions: true,
        },
    });

    // Si le rôle a changé, mettre à jour les permissions par défaut
    if (data.role && data.role !== existingUser.role) {
        await updatePermissionsForRole(userId, data.role);
    }

    // Logger l'activité
    if (updatedByUserId) {
        await logUserActivity({
            userId: updatedByUserId,
            action: "UPDATE",
            resource: "User",
            resourceId: userId,
            details: data as Record<string, unknown>,
        });
    }

    return user;
}

/**
 * Supprimer un utilisateur (soft delete)
 */
export async function deleteUser(
    userId: string,
    entrepriseId: string,
    deletedByUserId?: string
) {
    // Vérifier que l'utilisateur existe
    const user = await getUserById(userId, entrepriseId);

    // Ne pas permettre de supprimer le propriétaire
    if (user.role === USER_ROLES.OWNER) {
        throw new Error(ERROR_MESSAGES.CANNOT_DELETE_OWNER);
    }

    // Soft delete: marquer l'utilisateur comme DELETED au lieu de le supprimer
    await prisma.user.update({
        where: { id: userId },
        data: {
            status: USER_STATUS.DELETED,
            lastActivityAt: new Date(),
        },
    });

    // Logger l'activité
    if (deletedByUserId) {
        await logUserActivity({
            userId: deletedByUserId,
            action: "DELETE",
            resource: "User",
            resourceId: userId,
            details: { email: user.email, role: user.role },
        });
    }

    return { success: true };
}

/**
 * Désactiver/Activer un utilisateur
 */
export async function toggleUserStatus(
    userId: string,
    entrepriseId: string,
    newStatus: UserStatus,
    updatedByUserId?: string
) {
    const user = await updateUser(
        userId,
        entrepriseId,
        { status: newStatus },
        updatedByUserId
    );

    return user;
}

// ============================================
// GESTION DES PERMISSIONS
// ============================================

/**
 * Créer les permissions par défaut pour un rôle
 */
export async function createDefaultPermissions(userId: string, role: UserRole) {
    const defaultPerms = getDefaultPermissions(role);

    return await prisma.userPermissions.create({
        data: {
            userId,
            ...defaultPerms,
        },
    });
}

/**
 * Mettre à jour les permissions d'un utilisateur
 */
export async function updateUserPermissions(
    userId: string,
    permissions: Partial<Record<string, boolean>>,
    updatedByUserId?: string
) {
    const updated = await prisma.userPermissions.upsert({
        where: { userId },
        update: permissions,
        create: {
            userId,
            ...permissions,
        },
    });

    // Logger l'activité
    if (updatedByUserId) {
        await logUserActivity({
            userId: updatedByUserId,
            action: "UPDATE",
            resource: "UserPermissions",
            resourceId: userId,
            details: permissions,
        });
    }

    return updated;
}

/**
 * Mettre à jour les permissions selon le nouveau rôle
 */
async function updatePermissionsForRole(userId: string, role: UserRole) {
    const defaultPerms = getDefaultPermissions(role);

    return await prisma.userPermissions.update({
        where: { userId },
        data: defaultPerms,
    });
}

/**
 * Vérifier si un utilisateur a une permission spécifique
 */
export async function userHasPermission(
    userId: string,
    permission: string
): Promise<boolean> {
    const userPerms = await prisma.userPermissions.findUnique({
        where: { userId },
    });

    if (!userPerms) return false;

    return (userPerms as Record<string, unknown>)[permission] === true;
}

// ============================================
// GESTION DES HORAIRES
// ============================================

/**
 * Définir les horaires de travail d'un utilisateur
 */
export async function setUserSchedule(
    userId: string,
    schedules: Array<{
        dayOfWeek: number; // 0-6 (Dimanche-Samedi)
        startTime: string; // "HH:mm"
        endTime: string;
        breakStart?: string;
        breakEnd?: string;
        active: boolean;
    }>
) {
    // Supprimer les anciens horaires
    await prisma.userSchedule.deleteMany({
        where: { userId },
    });

    // Créer les nouveaux horaires
    if (schedules.length > 0) {
        await prisma.userSchedule.createMany({
            data: schedules.map((s) => ({
                userId,
                ...s,
            })),
        });
    }

    return await prisma.userSchedule.findMany({
        where: { userId },
        orderBy: { dayOfWeek: "asc" },
    });
}

/**
 * Récupérer les horaires d'un utilisateur
 */
export async function getUserSchedule(userId: string) {
    return await prisma.userSchedule.findMany({
        where: { userId },
        orderBy: { dayOfWeek: "asc" },
    });
}

// ============================================
// GESTION DU TEMPS (TIME TRACKING)
// ============================================

/**
 * Pointer l'arrivée (clock in)
 */
export async function clockIn(
    userId: string,
    date: Date = new Date(),
    notes?: string
) {
    // Vérifier qu'il n'y a pas déjà un pointage en cours
    const existingEntry = await prisma.timeEntry.findFirst({
        where: {
            userId,
            date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999)),
            },
            clockOut: null,
        },
    });

    if (existingEntry) {
        throw new Error(ERROR_MESSAGES.ALREADY_CLOCKED_IN);
    }

    return await prisma.timeEntry.create({
        data: {
            userId,
            date: new Date(date.setHours(0, 0, 0, 0)),
            clockIn: new Date(),
            notes,
        },
    });
}

/**
 * Pointer la sortie (clock out)
 */
export async function clockOut(
    userId: string,
    breakDuration: number = 0, // en minutes
    date: Date = new Date()
) {
    // Trouver le pointage en cours
    const entry = await prisma.timeEntry.findFirst({
        where: {
            userId,
            date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999)),
            },
            clockOut: null,
        },
    });

    if (!entry) {
        throw new Error(ERROR_MESSAGES.NO_CLOCK_IN_FOUND);
    }

    const clockOutTime = new Date();

    // Calculer les heures travaillées
    const totalMinutes = Math.floor(
        (clockOutTime.getTime() - entry.clockIn.getTime()) / MS_PER_MINUTE
    );
    const workedMinutes = totalMinutes - breakDuration;
    const hoursWorked = Math.round((workedMinutes / 60) * 100) / 100;

    return await prisma.timeEntry.update({
        where: { id: entry.id },
        data: {
            clockOut: clockOutTime,
            breakDuration,
            hoursWorked,
        },
    });
}

/**
 * Créer une entrée de temps manuellement (pour corrections)
 */
export async function createTimeEntry(
    userId: string,
    data: {
        date: Date;
        clockIn: Date;
        clockOut: Date;
        breakDuration?: number;
        notes?: string;
        type?: "REGULAR" | "OVERTIME" | "SICK_LEAVE" | "VACATION" | "REMOTE";
    }
) {
    // Calculer les heures travaillées
    const totalMinutes = Math.floor(
        (data.clockOut.getTime() - data.clockIn.getTime()) / MS_PER_MINUTE
    );
    const workedMinutes = totalMinutes - (data.breakDuration || 0);
    const hoursWorked = Math.round((workedMinutes / 60) * 100) / 100;

    return await prisma.timeEntry.create({
        data: {
            userId,
            date: new Date(data.date.setHours(0, 0, 0, 0)),
            clockIn: data.clockIn,
            clockOut: data.clockOut,
            breakDuration: data.breakDuration || 0,
            hoursWorked,
            notes: data.notes,
            type: data.type || TIME_ENTRY_TYPE.REGULAR,
        },
    });
}

/**
 * Récupérer les entrées de temps d'un utilisateur
 */
export async function getTimeEntries(
    userId: string,
    startDate: Date,
    endDate: Date
) {
    return await prisma.timeEntry.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { date: "desc" },
    });
}

/**
 * Valider une entrée de temps
 */
export async function validateTimeEntry(
    entryId: string,
    validatedByUserId: string
) {
    return await prisma.timeEntry.update({
        where: { id: entryId },
        data: {
            validated: true,
            validatedBy: validatedByUserId,
            validatedAt: new Date(),
        },
    });
}

/**
 * Calculer les heures totales travaillées sur une période
 */
export async function getTotalHoursWorked(
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<number> {
    const entries = await getTimeEntries(userId, startDate, endDate);

    return entries.reduce((total, entry) => {
        return total + (entry.hoursWorked ? Number(entry.hoursWorked) : 0);
    }, 0);
}

// ============================================
// AUDIT & ACTIVITÉS
// ============================================

/**
 * Logger une activité utilisateur
 */
export async function logUserActivity(data: {
    userId: string;
    action:
        | "LOGIN"
        | "LOGOUT"
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "VIEW"
        | "EXPORT"
        | "PRINT"
        | "SEND_EMAIL"
        | "PAYMENT_RECEIVED"
        | "SETTINGS_CHANGED";
    resource?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}) {
    return await prisma.userActivity.create({
        data: {
            userId: data.userId,
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            details: data.details as any,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
        },
    });
}

/**
 * Récupérer l'historique d'activité
 */
export async function getUserActivities(
    userId: string,
    limit: number = DEFAULT_ACTIVITY_LIMITS.USER,
    offset: number = 0
) {
    return await prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
    });
}

/**
 * Récupérer l'historique d'activité de toute l'entreprise
 */
export async function getCompanyActivities(
    entrepriseId: string,
    limit: number = DEFAULT_ACTIVITY_LIMITS.COMPANY,
    offset: number = 0,
    filters?: {
        userId?: string;
        action?: string;
        resource?: string;
        startDate?: Date;
        endDate?: Date;
    }
) {
    const where: Record<string, unknown> = {};

    if (filters?.userId) {
        where.userId = filters.userId;
    }

    if (filters?.action) {
        where.action = filters.action;
    }

    if (filters?.resource) {
        where.resource = filters.resource;
    }

    if (filters?.startDate || filters?.endDate) {
        where.createdAt = {} as { gte?: Date; lte?: Date };
        if (filters.startDate)
            (where.createdAt as { gte?: Date; lte?: Date }).gte =
                filters.startDate;
        if (filters.endDate)
            (where.createdAt as { gte?: Date; lte?: Date }).lte =
                filters.endDate;
    }

    const activities = await prisma.userActivity.findMany({
        where: {
            ...where,
            user: {
                entrepriseId,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    prenom: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
    });

    return activities;
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Obtenir les statistiques du personnel (exclut les utilisateurs supprimés)
 */
export async function getPersonnelStats(entrepriseId: string) {
    const totalUsers = await prisma.user.count({
        where: {
            entrepriseId,
            status: { not: USER_STATUS.DELETED },
        },
    });

    const activeUsers = await prisma.user.count({
        where: { entrepriseId, status: USER_STATUS.ACTIVE },
    });

    const invitedUsers = await prisma.user.count({
        where: { entrepriseId, status: USER_STATUS.INVITED },
    });

    const usersByRole = await prisma.user.groupBy({
        by: ["role"],
        where: {
            entrepriseId,
            status: { not: USER_STATUS.DELETED },
        },
        _count: true,
    });

    return {
        total: totalUsers,
        active: activeUsers,
        invited: invitedUsers,
        byRole: usersByRole,
    };
}

// ============================================
// INVITATIONS
// ============================================

/**
 * Envoyer une invitation par email à un nouvel utilisateur
 */
export async function sendUserInvitation(
    entrepriseId: string,
    email: string,
    name?: string,
    prenom?: string,
    role?: UserRole,
    invitedByUserId?: string
): Promise<boolean> {
    try {
        // Vérifier si une invitation existe déjà et est valide
        const existingInvitation = await prisma.userInvitationToken.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                entrepriseId,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        let token: string;

        if (existingInvitation) {
            // Réutiliser le token existant
            token = existingInvitation.token;
        } else {
            // Créer un nouveau token d'invitation
            token = nanoid(TOKEN_LENGTH);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

            await prisma.userInvitationToken.create({
                data: {
                    token,
                    email,
                    name: name || null,
                    prenom: prenom || null,
                    role: role || USER_ROLES.EMPLOYEE,
                    entrepriseId,
                    invitedBy: invitedByUserId || "",
                    expiresAt,
                },
            });
        }

        // Récupérer les informations de l'entreprise et de l'inviteur
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            select: { nom: true },
        });

        let inviterName = DEFAULT_INVITER_NAME;
        if (invitedByUserId) {
            const inviter = await prisma.user.findUnique({
                where: { id: invitedByUserId },
                select: { name: true, prenom: true },
            });

            if (inviter) {
                inviterName = inviter.prenom
                    ? `${inviter.prenom}${inviter.name ? " " + inviter.name : ""}`
                    : inviter.name || DEFAULT_INVITER_NAME;
            }
        }

        // Envoyer l'email d'invitation
        const result = await emailService.sendTeamInvitation({
            to: email,
            inviteeName: prenom || name || "",
            inviterName,
            entrepriseName: entreprise?.nom || DEFAULT_ENTREPRISE_NAME,
            role: role || USER_ROLES.EMPLOYEE,
            invitationToken: token,
        });

        if (!result.success) {
            return false;
        }

        return true;
    } catch (_error) {
        return false;
    }
}

// ============================================
// HELPERS
// ============================================

/**
 * Générer un mot de passe temporaire
 */
function generateTemporaryPassword(): string {
    let password = "";
    for (let i = 0; i < PASSWORD_LENGTH; i++) {
        password += PASSWORD_CHARS.charAt(
            Math.floor(Math.random() * PASSWORD_CHARS.length)
        );
    }
    return password;
}

/**
 * Vérifier si l'entreprise peut ajouter un nouvel utilisateur (limite plan)
 */
export async function canAddUser(entrepriseId: string): Promise<boolean> {
    const { getPlanConfig } = await import("@/lib/config/plans.config");
    type PlanType = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

    const entreprise = await prisma.entreprise.findUnique({
        where: { id: entrepriseId },
        select: { plan: true },
    });

    if (!entreprise) return false;

    const currentUserCount = await prisma.user.count({
        where: { entrepriseId, status: { in: ["ACTIVE", "INVITED"] } },
    });

    // Utiliser la configuration centralisée du pricing
    const planConfig = getPlanConfig(entreprise.plan as PlanType);
    const limit = planConfig.limits.maxUsers;

    if (limit === -1) return true; // illimité

    return currentUserCount < limit;
}
