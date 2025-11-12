export type TransactionStatus =
    | "PENDING"
    | "MATCHED"
    | "MANUAL"
    | "IGNORED"
    | "ANOMALY";

export interface BankTransaction {
    id: string;
    date: Date;
    libelle: string;
    montant: number;
    reference: string | null;
    statut: TransactionStatus;
    notes: string | null;
    document?: {
        id: string;
        numero: string;
        client: {
            nom: string;
        };
    } | null;
}

export interface BankReconciliationStats {
    total: number;
    matched: number;
    pending: number;
    anomalies: number;
    matchRate: string;
}

export interface InvoiceForMatching {
    id: string;
    numero: string;
    total_ttc: number;
    client: {
        nom: string;
    };
}

export const TRANSACTION_STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    MATCHED: {
        label: "Rapproché (auto)",
        className: "bg-green-100 text-green-800 border-green-200",
    },
    MANUAL: {
        label: "Rapproché (manuel)",
        className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    IGNORED: {
        label: "Ignoré",
        className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    ANOMALY: {
        label: "Anomalie",
        className: "bg-red-100 text-red-800 border-red-200",
    },
} as const;
