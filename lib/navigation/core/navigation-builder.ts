/**
 * Navigation Builder - Core engine that builds navigation from business presets
 * This is the brain of the adaptive navigation system
 */

import { BusinessType } from "@prisma/client";
import {
  Navigation,
  NavigationItem,
  QuickAction,
  ResolvedNavigation,
  NavigationBuilderOptions,
} from "./types";
import { FEATURE_CATALOG } from "@/lib/features";
import { BUSINESS_PRESETS } from "../presets";

export class NavigationBuilder {
  /**
   * Build complete navigation for a business type
   */
  static build(
    businessType: BusinessType,
    options?: NavigationBuilderOptions
  ): ResolvedNavigation {
    // 1. Get the preset
    const preset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.GENERAL;

    // 2. Determine which features to use
    const features = options?.overrideFeatures || preset.features;

    // 3. Resolve feature dependencies
    const resolvedFeatures = this.resolveDependencies(features);

    // 4. Build navigation items
    const navItems = this.buildNavigationItems(
      resolvedFeatures,
      preset.i18n,
      options?.overrideI18n
    );

    // 5. Build quick actions
    const quickActions = this.buildQuickActions(
      resolvedFeatures,
      preset.quickActions
    );

    // 6. Get all active routes
    const activeRoutes = this.getActiveRoutes(resolvedFeatures);

    // 7. Merge settings
    const settings = {
      ...preset.settings,
      ...options?.overrideSettings,
    };

    return {
      items: navItems,
      quickActions,
      settings,
      dashboardWidgets: preset.dashboardWidgets,
      businessType,
      activeFeatures: resolvedFeatures,
      activeRoutes,
    };
  }

  /**
   * Resolve feature dependencies using topological sort
   * Ensures all required features are included
   */
  private static resolveDependencies(features: string[]): string[] {
    const resolved = new Set<string>();
    const visited = new Set<string>();

    const visit = (featureId: string) => {
      // Avoid circular dependencies
      if (visited.has(featureId)) return;
      visited.add(featureId);

      const feature = FEATURE_CATALOG[featureId];
      if (!feature) {
        console.warn(`Feature '${featureId}' not found in catalog`);
        return;
      }

      // Visit dependencies first
      if (feature.dependencies) {
        for (const dep of feature.dependencies) {
          visit(dep);
        }
      }

      // Then add this feature
      resolved.add(featureId);
    };

    // Visit all requested features
    for (const featureId of features) {
      visit(featureId);
    }

    return Array.from(resolved);
  }

  /**
   * Build navigation items from features
   */
  private static buildNavigationItems(
    featureIds: string[],
    presetI18n?: Record<string, Record<string, string>>,
    overrideI18n?: Record<string, Record<string, string>>
  ): NavigationItem[] {
    const items: NavigationItem[] = [];

    for (const featureId of featureIds) {
      const feature = FEATURE_CATALOG[featureId];
      if (!feature || !feature.navigation?.main) continue;

      const { main, subItems } = feature.navigation;

      // Apply i18n overrides
      const i18n = {
        ...feature.i18n,
        ...presetI18n?.[featureId],
        ...overrideI18n?.[featureId],
      };

      const label = i18n?.plural || main.label;

      const navItem: NavigationItem = {
        key: featureId,
        label,
        icon: main.icon,
        href: main.href,
        order: main.order,
        badge: main.badge,
        items: subItems?.map((sub) => ({
          key: `${featureId}-${sub.href}`,
          label: sub.label,
          href: sub.href,
          order: sub.order || 0,
        })),
      };

      items.push(navItem);
    }

    // Sort by order
    return items.sort((a, b) => a.order - b.order);
  }

  /**
   * Build quick actions from features
   */
  private static buildQuickActions(
    featureIds: string[],
    customQuickActions?: Array<{
      feature: string;
      action: string;
      label: string;
      icon?: string;
    }>
  ): QuickAction[] {
    const actions: QuickAction[] = [];

    // Add quick actions from features
    for (const featureId of featureIds) {
      const feature = FEATURE_CATALOG[featureId];
      if (!feature || !feature.navigation?.quickActions) continue;

      for (const qa of feature.navigation.quickActions) {
        actions.push({
          key: `${featureId}-${qa.href}`,
          label: qa.label,
          icon: qa.icon,
          href: qa.href,
          order: qa.order || 999,
        });
      }
    }

    // Add custom quick actions from preset
    if (customQuickActions) {
      for (const qa of customQuickActions) {
        const feature = FEATURE_CATALOG[qa.feature];
        if (!feature) continue;

        actions.push({
          key: `custom-${qa.feature}-${qa.action}`,
          label: qa.label,
          icon: qa.icon || "Plus",
          href: feature.navigation?.main?.href || "/dashboard",
          order: 0,
        });
      }
    }

    // Sort by order and limit to 3
    return actions.sort((a, b) => (a.order || 999) - (b.order || 999)).slice(0, 3);
  }

  /**
   * Get all active routes from enabled features
   */
  private static getActiveRoutes(featureIds: string[]): string[] {
    const routes = new Set<string>();

    for (const featureId of featureIds) {
      const feature = FEATURE_CATALOG[featureId];
      if (!feature) continue;

      for (const route of feature.routes) {
        routes.add(route);
      }
    }

    return Array.from(routes);
  }

  /**
   * Check if a route is active for a business type
   */
  static isRouteActive(
    route: string,
    businessType: BusinessType
  ): boolean {
    const navigation = this.build(businessType);
    return navigation.activeRoutes.includes(route);
  }

  /**
   * Check if a feature is active for a business type
   */
  static isFeatureActive(
    featureId: string,
    businessType: BusinessType
  ): boolean {
    const navigation = this.build(businessType);
    return navigation.activeFeatures.includes(featureId);
  }

  /**
   * Get translated label for a feature
   */
  static getFeatureLabel(
    featureId: string,
    businessType: BusinessType,
    key: "singular" | "plural" = "plural"
  ): string {
    const preset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.GENERAL;
    const feature = FEATURE_CATALOG[featureId];

    if (!feature) return featureId;

    // Check preset i18n override
    const presetTranslation = preset.i18n?.[featureId]?.[key];
    if (presetTranslation) return presetTranslation;

    // Check feature default i18n
    const featureTranslation = feature.i18n?.[key];
    if (featureTranslation) return featureTranslation;

    // Fallback to feature name
    return feature.name;
  }

  /**
   * Get setting value for a feature
   */
  static getFeatureSetting<T = any>(
    featureId: string,
    settingKey: string,
    businessType: BusinessType,
    defaultValue?: T
  ): T | undefined {
    const preset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.GENERAL;
    const featureSettings = preset.settings?.[featureId];

    if (!featureSettings) return defaultValue;

    return featureSettings[settingKey] ?? defaultValue;
  }
}
