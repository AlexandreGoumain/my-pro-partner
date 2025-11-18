/**
 * Design System Constants
 *
 * Centralized design tokens following Apple-inspired minimalist design principles.
 * These constants ensure consistency across the entire application.
 *
 * Usage:
 * import { DS } from '@/lib/constants/design-system';
 * <h1 className={DS.text.heading.h1}>Title</h1>
 */

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  // Heading styles
  heading: {
    h1: "text-[28px] font-semibold tracking-[-0.02em]",
    h2: "text-[20px] font-semibold tracking-[-0.01em]",
    h3: "text-[17px] font-semibold tracking-[-0.01em]",
    h4: "text-[15px] font-semibold tracking-[-0.01em]",
  },

  // Body text styles
  body: {
    large: "text-[15px]",
    base: "text-[14px]",
    small: "text-[13px]",
    xs: "text-[12px]",
  },

  // Font weights
  weight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },

  // Letter spacing
  tracking: {
    tight: "tracking-[-0.02em]",
    normal: "tracking-[-0.01em]",
    wide: "tracking-[0.01em]",
  },
} as const;

// ============================================================================
// COLORS
// ============================================================================

export const COLORS = {
  // Text colors
  text: {
    primary: "text-black",
    secondary: "text-black/60",
    tertiary: "text-black/40",
    quaternary: "text-black/20",
    white: "text-white",
    muted: "text-black/50",
  },

  // Background colors
  bg: {
    white: "bg-white",
    black: "bg-black",
    subtle: "bg-black/2",
    hover: "bg-black/5",
    selected: "bg-black/10",
    strong: "bg-black/20",
  },

  // Border colors
  border: {
    light: "border-black/5",
    default: "border-black/8",
    medium: "border-black/10",
    strong: "border-black/20",
    focus: "border-black/30",
  },
} as const;

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const SPACING = {
  // Common padding combinations
  padding: {
    page: "px-6 py-6",
    section: "p-6",
    card: "p-6",
    cardCompact: "p-4",
    button: "px-6 py-3",
  },

  // Common margins
  margin: {
    section: "mb-6",
    element: "mb-4",
    small: "mb-2",
  },

  // Gaps
  gap: {
    small: "gap-2",
    medium: "gap-3",
    large: "gap-4",
    xl: "gap-6",
  },
} as const;

export const SIZES = {
  // Button sizes
  button: {
    default: "h-11 px-6",
    small: "h-9 px-4",
    large: "h-12 px-8",
    icon: "h-11 w-11",
  },

  // Icon sizes
  icon: {
    xs: "h-3 w-3",
    small: "h-4 w-4",
    default: "h-5 w-5",
    large: "h-6 w-6",
    xl: "h-8 w-8",
    strokeWidth: 2,
  },

  // Input sizes
  input: {
    default: "h-11",
    small: "h-9",
    large: "h-12",
  },

  // Border radius
  radius: {
    small: "rounded",
    default: "rounded-md",
    large: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },

  // Shadows
  shadow: {
    none: "",
    small: "shadow-sm",
    default: "shadow",
    medium: "shadow-md",
  },
} as const;

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const ANIMATIONS = {
  // Transitions
  transition: {
    fast: "transition-all duration-200",
    normal: "transition-all duration-300",
    slow: "transition-all duration-500",
    colors: "transition-colors duration-200",
  },

  // Common animation classes
  hover: {
    lift: "hover:shadow-md transition-shadow duration-200",
    scale: "hover:scale-[1.02] transition-transform duration-200",
    opacity: "hover:opacity-80 transition-opacity duration-200",
  },
} as const;

// ============================================================================
// COMPONENT STYLES
// ============================================================================

export const COMPONENTS = {
  // Button variants
  button: {
    primary: "bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm transition-all duration-200",
    secondary: "border border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium rounded-md transition-all duration-200",
    ghost: "hover:bg-black/5 h-11 px-6 text-[14px] font-medium rounded-md transition-all duration-200",
    destructive: "bg-red-600 hover:bg-red-700 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm transition-all duration-200",
  },

  // Card styles
  card: {
    default: "bg-white border border-black/8 rounded-lg shadow-sm",
    hover: "bg-white border border-black/8 rounded-lg shadow-sm hover:border-black/10 transition-all duration-200",
    interactive: "bg-white border border-black/8 rounded-lg shadow-sm hover:border-black/10 hover:shadow-md transition-all duration-200 cursor-pointer",
  },

  // Input styles
  input: {
    default: "h-11 px-4 border border-black/10 rounded-md text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all duration-200",
    error: "h-11 px-4 border border-red-500 rounded-md text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200",
  },

  // Badge styles
  badge: {
    default: "inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-black/5 text-black/60",
    success: "inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-green-50 text-green-700 border border-green-200",
    warning: "inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200",
    error: "inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium bg-red-50 text-red-700 border border-red-200",
  },

  // Empty state
  emptyState: {
    container: "flex flex-col items-center justify-center py-12 px-6",
    icon: "h-12 w-12 text-black/20 mb-4",
    title: "text-[15px] font-medium text-black/60 mb-2",
    description: "text-[14px] text-black/40 text-center mb-6",
  },

  // Page header
  pageHeader: {
    container: "flex items-center justify-between mb-6",
    titleSection: "flex flex-col gap-1",
    title: "text-[28px] font-semibold tracking-[-0.02em] text-black",
    description: "text-[14px] text-black/40",
    actions: "flex items-center gap-3",
  },

  // Section header
  sectionHeader: {
    container: "flex items-center justify-between mb-4",
    title: "text-[17px] font-semibold tracking-[-0.01em] text-black",
    description: "text-[14px] text-black/40",
  },

  // Table
  table: {
    container: "w-full border border-black/8 rounded-lg overflow-hidden",
    header: "bg-black/2 border-b border-black/8",
    headerCell: "px-6 py-3 text-left text-[13px] font-medium text-black/60",
    row: "border-b border-black/8 hover:bg-black/2 transition-colors duration-200",
    cell: "px-6 py-4 text-[14px] text-black",
  },

  // Dialog/Modal
  dialog: {
    overlay: "fixed inset-0 bg-black/40 backdrop-blur-sm",
    content: "bg-white rounded-lg shadow-lg border border-black/8 p-6",
    header: "mb-4",
    title: "text-[20px] font-semibold tracking-[-0.01em] text-black",
    description: "text-[14px] text-black/40 mt-1",
    footer: "flex items-center justify-end gap-3 mt-6",
  },
} as const;

// ============================================================================
// LAYOUT
// ============================================================================

export const LAYOUT = {
  // Container widths
  container: {
    full: "w-full",
    max: "max-w-7xl mx-auto",
    tight: "max-w-4xl mx-auto",
  },

  // Flex utilities
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    colCenter: "flex flex-col items-center justify-center",
  },

  // Grid
  grid: {
    auto: "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
    cols2: "grid grid-cols-2",
    cols3: "grid grid-cols-3",
    cols4: "grid grid-cols-4",
  },
} as const;

// ============================================================================
// EXPORT AS SINGLE OBJECT
// ============================================================================

export const DS = {
  text: TYPOGRAPHY,
  color: COLORS,
  spacing: SPACING,
  size: SIZES,
  animation: ANIMATIONS,
  component: COMPONENTS,
  layout: LAYOUT,
} as const;

// Export individual categories for convenience
export {
  TYPOGRAPHY as text,
  COLORS as color,
  SPACING as spacing,
  SIZES as size,
  ANIMATIONS as animation,
  COMPONENTS as component,
  LAYOUT as layout,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

import { cn } from "@/lib/utils";

/**
 * Create a button class with variant
 *
 * @example
 * buttonClass("primary", "custom-class")
 */
export function buttonClass(variant: keyof typeof COMPONENTS.button = "primary", className?: string): string {
  return cn(COMPONENTS.button[variant], className);
}

/**
 * Create a card class with variant
 *
 * @example
 * cardClass("hover", "p-4")
 */
export function cardClass(variant: keyof typeof COMPONENTS.card = "default", className?: string): string {
  return cn(COMPONENTS.card[variant], className);
}

/**
 * Create an icon class with size
 *
 * @example
 * iconClass("large", "text-blue-500")
 */
export function iconClass(size: keyof typeof SIZES.icon = "default", className?: string): string {
  const sizeClass = SIZES.icon[size];
  return cn(
    typeof sizeClass === "number" ? "" : sizeClass,
    className
  );
}

/**
 * Create a page header title class
 */
export function pageHeaderTitleClass(className?: string): string {
  return cn(COMPONENTS.pageHeader.title, className);
}

/**
 * Create a page header description class
 */
export function pageHeaderDescriptionClass(className?: string): string {
  return cn(COMPONENTS.pageHeader.description, className);
}
