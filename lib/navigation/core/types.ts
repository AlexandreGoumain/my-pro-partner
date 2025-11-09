/**
 * Core types for the business-adaptive navigation system
 * This file defines all TypeScript types used across the navigation system
 */

import { LucideIcon } from "lucide-react";
import { BusinessType } from "@prisma/client";

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavigationItem {
  /** Unique identifier for this nav item */
  key: string;

  /** Display label */
  label: string;

  /** Icon name from lucide-react */
  icon: string;

  /** URL path */
  href: string;

  /** Display order (lower = higher in list) */
  order: number;

  /** Sub-items for collapsible menus */
  items?: NavigationSubItem[];

  /** Badge to display (e.g., count, "New") */
  badge?: string | number;

  /** Feature flag required to show this item */
  requiredFeature?: string;
}

export interface NavigationSubItem {
  key: string;
  label: string;
  href: string;
  order?: number;
}

export interface QuickAction {
  key: string;
  label: string;
  icon: string;
  href: string;
  order?: number;
}

export interface Navigation {
  /** Main navigation items */
  items: NavigationItem[];

  /** Quick action shortcuts */
  quickActions: QuickAction[];

  /** Business-specific settings */
  settings: Record<string, any>;

  /** Dashboard widgets to display */
  dashboardWidgets?: string[];
}

// ============================================
// FEATURE MODULE TYPES
// ============================================

export interface FeatureNavigation {
  /** Main navigation entry */
  main?: {
    icon: string;
    label: string;
    href: string;
    order: number;
    badge?: string | number;
  };

  /** Sub-items under main */
  subItems?: {
    label: string;
    href: string;
    order?: number;
  }[];

  /** Quick actions this feature provides */
  quickActions?: {
    label: string;
    icon: string;
    href: string;
    order?: number;
  }[];
}

export interface FeatureModule {
  /** Unique feature identifier */
  id: string;

  /** Display name */
  name: string;

  /** Navigation provided by this feature */
  navigation?: FeatureNavigation;

  /** Routes that this feature activates */
  routes: string[];

  /** Required permissions */
  permissions?: string[];

  /** Dependencies on other features */
  dependencies?: string[];

  /** i18n vocabulary customization */
  i18n?: {
    singular?: string;
    plural?: string;
    [key: string]: string | undefined;
  };

  /** Feature-specific settings schema */
  settings?: Record<string, any>;
}

// ============================================
// BUSINESS PRESET TYPES
// ============================================

export interface BusinessPreset {
  /** Business type identifier (matches Prisma enum) */
  id: BusinessType;

  /** Display name */
  name: string;

  /** Icon name */
  icon: string;

  /** Brand color */
  color: string;

  /** Description */
  description?: string;

  /** Features to enable (by ID) */
  features: string[];

  /** Vocabulary customization per feature */
  i18n?: Record<string, Record<string, string>>;

  /** Feature-specific settings */
  settings?: Record<string, any>;

  /** Custom quick actions */
  quickActions?: {
    feature: string;
    action: string;
    label: string;
    icon?: string;
  }[];

  /** Dashboard widgets to display */
  dashboardWidgets?: string[];

  /** Base preset to extend from */
  extends?: string;
}

// ============================================
// BUILDER TYPES
// ============================================

export interface NavigationBuilderOptions {
  /** Override features */
  overrideFeatures?: string[];

  /** Override settings */
  overrideSettings?: Record<string, any>;

  /** Override i18n */
  overrideI18n?: Record<string, Record<string, string>>;
}

export interface ResolvedNavigation extends Navigation {
  /** The business type used */
  businessType: BusinessType;

  /** All active features */
  activeFeatures: string[];

  /** All active routes */
  activeRoutes: string[];
}

// ============================================
// UTILITY TYPES
// ============================================

export type FeatureId = string;
export type PresetId = BusinessType;

/** Helper type for defining presets */
export type PresetDefinition = Omit<BusinessPreset, "id">;

/** Navigation item with resolved icon */
export interface NavigationItemWithIcon extends Omit<NavigationItem, "icon"> {
  icon: LucideIcon;
}
