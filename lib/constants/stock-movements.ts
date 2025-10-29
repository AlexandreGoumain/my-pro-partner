import { TypeMouvement } from "@/lib/generated/prisma";

// Configuration des types de mouvements de stock
export const STOCK_MOVEMENT_CONFIG = {
  ENTREE: {
    label: "Entrée",
    description: "Réception de stock (livraison fournisseur)",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: "↑",
  },
  SORTIE: {
    label: "Sortie",
    description: "Sortie de stock (vente, consommation)",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "↓",
  },
  AJUSTEMENT: {
    label: "Ajustement",
    description: "Correction manuelle du stock",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "⚙",
  },
  INVENTAIRE: {
    label: "Inventaire",
    description: "Ajustement suite à inventaire",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: "📋",
  },
  RETOUR: {
    label: "Retour",
    description: "Retour client ou fournisseur",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: "↩",
  },
} as const;

// Liste des types de mouvements pour les sélecteurs
export const STOCK_MOVEMENT_TYPES = [
  { value: "ENTREE" as TypeMouvement, label: "Entrée de stock" },
  { value: "SORTIE" as TypeMouvement, label: "Sortie de stock" },
  { value: "AJUSTEMENT" as TypeMouvement, label: "Ajustement manuel" },
  { value: "INVENTAIRE" as TypeMouvement, label: "Inventaire" },
  { value: "RETOUR" as TypeMouvement, label: "Retour" },
];

// Fonction helper pour obtenir la configuration d'un type de mouvement
export function getMovementConfig(type: TypeMouvement) {
  return STOCK_MOVEMENT_CONFIG[type];
}

// Fonction helper pour obtenir le label d'un type de mouvement
export function getMovementLabel(type: TypeMouvement) {
  return STOCK_MOVEMENT_CONFIG[type].label;
}
