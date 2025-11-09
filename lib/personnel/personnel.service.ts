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

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "@prisma/client";
import { DEFAULT_ROLE_PERMISSIONS, getDefaultPermissions } from "./roles-config";

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
  permissions?: any;
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
    throw new Error("Cet email est déjà utilisé");
  }

  // Générer un mot de passe temporaire si non fourni
  const tempPassword = data.password || generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Déterminer le statut initial
  const status: UserStatus = data.sendInvitation ? "INVITED" : "ACTIVE";

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

  // TODO: Envoyer l'email d'invitation si sendInvitation = true

  return user;
}

/**
 * Récupérer tous les utilisateurs d'une entreprise
 */
export async function getUsers(
  entrepriseId: string,
  filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  }
) {
  const where: any = {
    entrepriseId,
  };

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.status) {
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
    throw new Error("Utilisateur introuvable");
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
      throw new Error("Cet email est déjà utilisé");
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
      details: data,
    });
  }

  return user;
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUser(
  userId: string,
  entrepriseId: string,
  deletedByUserId?: string
) {
  // Vérifier que l'utilisateur existe
  const user = await getUserById(userId, entrepriseId);

  // Ne pas permettre de supprimer le propriétaire
  if (user.role === "OWNER") {
    throw new Error("Impossible de supprimer le propriétaire de l'entreprise");
  }

  // Supprimer l'utilisateur (cascade supprime les relations)
  await prisma.user.delete({
    where: { id: userId },
  });

  // Logger l'activité
  if (deletedByUserId) {
    await logUserActivity({
      userId: deletedByUserId,
      action: "DELETE",
      resource: "User",
      resourceId: userId,
      details: { email: user.email },
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

  return (userPerms as any)[permission] === true;
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
    throw new Error("Vous êtes déjà pointé. Veuillez pointer votre sortie d'abord.");
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
    throw new Error("Aucun pointage en cours trouvé");
  }

  const clockOutTime = new Date();

  // Calculer les heures travaillées
  const totalMinutes = Math.floor(
    (clockOutTime.getTime() - entry.clockIn.getTime()) / 1000 / 60
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
    (data.clockOut.getTime() - data.clockIn.getTime()) / 1000 / 60
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
      type: data.type || "REGULAR",
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
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT" | "PRINT" | "SEND_EMAIL" | "PAYMENT_RECEIVED" | "SETTINGS_CHANGED";
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await prisma.userActivity.create({
    data: {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
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
  limit: number = 50,
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
  limit: number = 100,
  offset: number = 0,
  filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const where: any = {};

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
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
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
 * Obtenir les statistiques du personnel
 */
export async function getPersonnelStats(entrepriseId: string) {
  const totalUsers = await prisma.user.count({
    where: { entrepriseId },
  });

  const activeUsers = await prisma.user.count({
    where: { entrepriseId, status: "ACTIVE" },
  });

  const invitedUsers = await prisma.user.count({
    where: { entrepriseId, status: "INVITED" },
  });

  const usersByRole = await prisma.user.groupBy({
    by: ["role"],
    where: { entrepriseId },
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
// HELPERS
// ============================================

/**
 * Générer un mot de passe temporaire
 */
function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Vérifier si l'entreprise peut ajouter un nouvel utilisateur (limite plan)
 */
export async function canAddUser(entrepriseId: string): Promise<boolean> {
  const entreprise = await prisma.entreprise.findUnique({
    where: { id: entrepriseId },
    select: { plan: true },
  });

  if (!entreprise) return false;

  const currentUserCount = await prisma.user.count({
    where: { entrepriseId, status: { in: ["ACTIVE", "INVITED"] } },
  });

  // Vérifier les limites selon le plan
  const limits = {
    FREE: 1,
    STARTER: 3,
    PRO: 10,
    ENTERPRISE: -1, // illimité
  };

  const limit = limits[entreprise.plan];

  if (limit === -1) return true; // illimité

  return currentUserCount < limit;
}
