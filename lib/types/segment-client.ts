// ============================================
// CLIENT-SAFE SEGMENT TYPES
// Types that can be used in client components
// ============================================

export type SegmentOperator =
  | "eq"          // equals
  | "ne"          // not equals
  | "gt"          // greater than
  | "gte"         // greater than or equal
  | "lt"          // less than
  | "lte"         // less than or equal
  | "contains"    // string contains
  | "startsWith"  // string starts with
  | "endsWith"    // string ends with
  | "exists"      // field has value (not null/undefined)
  | "notExists"   // field is null/undefined
  | "in"          // value in array
  | "notIn";      // value not in array

export type SegmentField =
  | "nom"
  | "prenom"
  | "email"
  | "telephone"
  | "ville"
  | "codePostal"
  | "pays"
  | "points_solde"
  | "niveauFideliteId"
  | "createdAt"
  | "updatedAt";

export interface SegmentCriterion {
  field: SegmentField;
  operator: SegmentOperator;
  value?: string | number | boolean | string[] | number[] | null;
}

export interface CustomSegmentCriteria {
  conditions: SegmentCriterion[];
  logic: "AND" | "OR";
}

export type PredefinedSegmentType =
  | "all"
  | "with-email"
  | "with-phone"
  | "with-loyalty"
  | "vip"
  | "recent"
  | "inactive";

export interface PredefinedSegmentCriteria {
  type: PredefinedSegmentType;
}

export type SegmentCriteria = CustomSegmentCriteria | PredefinedSegmentCriteria;

// Form types
export interface CreateSegmentForm {
  nom: string;
  description?: string;
  criteres: SegmentCriteria;
  icone?: string;
  couleur?: string;
  actif?: boolean;
}

export interface UpdateSegmentForm {
  nom?: string;
  description?: string;
  criteres?: SegmentCriteria;
  icone?: string;
  couleur?: string;
  actif?: boolean;
}
