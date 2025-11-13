import { Store as PrismaStore, Register as PrismaRegister } from "@/lib/generated/prisma";
import { Store as StoreIcon, CheckCircle2, AlertCircle, LucideIcon } from "lucide-react";

// Type from Prisma with relations
export type StoreWithRelations = PrismaStore & {
    registers?: PrismaRegister[];
    _count?: {
        documents: number;
        stockItems: number;
    };
};

// Frontend display type
export type StoreDisplay = {
    id: string;
    nom: string;
    code: string;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays: string;
    localisation?: string;
    telephone?: string | null;
    email?: string | null;
    isMainStore: boolean;
    status: string;
    timezone?: string | null;
    registersCount: number;
    documentsCount: number;
    stockItemsCount: number;
    createdAt: Date;
    updatedAt: Date;
};

// Store statistics
export interface StoresStats {
    total: number;
    active: number;
    inactive: number;
    mainStore?: StoreWithRelations;
    totalRegisters: number;
    averageRegistersPerStore: number;
}

// Status configuration
export interface StoreStatusConfig {
    label: string;
    className: string;
    icon: LucideIcon;
}

// Status configuration constants
export const STORE_STATUS_CONFIG: Record<string, StoreStatusConfig> = {
    ACTIVE: {
        label: "Actif",
        className: "bg-black/5 text-black border-black/10",
        icon: CheckCircle2,
    },
    INACTIVE: {
        label: "Inactif",
        className: "bg-black/5 text-black/40 border-black/10",
        icon: AlertCircle,
    },
    MAINTENANCE: {
        label: "Maintenance",
        className: "bg-black/5 text-black/60 border-black/10",
        icon: StoreIcon,
    },
};

// Mapper function from DB to display
export function mapStoreToDisplay(store: StoreWithRelations): StoreDisplay {
    let localisation = store.ville || "";
    if (store.codePostal && store.ville) {
        localisation = `${store.codePostal} ${store.ville}`;
    }
    if (localisation && store.pays && store.pays !== "France") {
        localisation += `, ${store.pays}`;
    }

    return {
        id: store.id,
        nom: store.nom,
        code: store.code,
        adresse: store.adresse,
        codePostal: store.codePostal,
        ville: store.ville,
        pays: store.pays,
        localisation: localisation || undefined,
        telephone: store.telephone,
        email: store.email,
        isMainStore: store.isMainStore,
        status: store.status,
        timezone: store.timezone,
        registersCount: store.registers?.length || 0,
        documentsCount: store._count?.documents || 0,
        stockItemsCount: store._count?.stockItems || 0,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
    };
}
