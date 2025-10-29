/**
 * Category-related types
 * Eliminates duplicate Category interface in dialog components
 */

export interface Category {
  id: string;
  nom: string;
  description?: string | null;
  parent_id?: string | null;
}

export interface CategoryWithRelations extends Category {
  parent?: Category | null;
  children?: Category[];
}

export interface CategoryTreeNode extends Category {
  level: number;
  children: CategoryTreeNode[];
}
