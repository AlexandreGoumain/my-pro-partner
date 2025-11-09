/**
 * Icon mapping - Maps icon names to Lucide React components
 */

import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  Car,
  CreditCard,
  Croissant,
  Dumbbell,
  FileText,
  Flame,
  Hammer,
  HardHat,
  Heart,
  Home,
  LayoutDashboard,
  Link,
  Mail,
  Monitor,
  Package,
  Paintbrush,
  Plug,
  Scale,
  Scissors,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  UtensilsCrossed,
  Users,
  UserPlus,
  Wrench,
  Zap,
  Plus,
  LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // Core
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,

  // Business Types
  Building2,
  Wrench,          // Plomberie
  Zap,             // Electricité
  Flame,           // Chauffage
  Hammer,          // Menuiserie
  Paintbrush,      // Peinture
  HardHat,         // Maçonnerie
  UtensilsCrossed, // Restauration
  Croissant,       // Boulangerie
  Scissors,        // Coiffure
  Sparkles,        // Esthétique
  Dumbbell,        // Fitness
  Car,             // Garage
  Monitor,         // Informatique
  Briefcase,       // Consulting
  Calculator,      // Comptabilité
  Scale,           // Juridique
  ShoppingCart,    // Commerce
  Home,            // Immobilier
  Heart,           // Santé

  // Features
  CalendarDays,    // Reservations
  Award,           // Loyalty
  Mail,            // Campaigns
  BarChart3,       // Analytics
  CreditCard,      // Terminals
  Link,            // Payment Links
  Store,           // Stores
  Plug,            // Integrations
  Plus,            // Quick actions
  UserPlus,        // Add client
};

/**
 * Get icon component by name
 * Returns a default icon if not found
 */
export function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Package;
}
