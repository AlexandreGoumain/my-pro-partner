/**
 * Icon mapping - Maps icon names to Lucide React components
 */

import {
    Award,
    BarChart3,
    Briefcase,
    Building2,
    Calculator,
    Calendar,
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
    LucideIcon,
    Mail,
    Monitor,
    Package,
    Paintbrush,
    Plug,
    Plus,
    RotateCcw,
    Scale,
    Scissors,
    Settings,
    ShoppingCart,
    Sparkles,
    Store,
    Truck,
    UserPlus,
    Users,
    UtensilsCrossed,
    Wrench,
    Zap,
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
    Wrench, // Plomberie
    Zap, // Electricité
    Flame, // Chauffage
    Hammer, // Menuiserie
    Paintbrush, // Peinture
    HardHat, // Maçonnerie
    UtensilsCrossed, // Restauration
    Croissant, // Boulangerie
    Scissors, // Coiffure
    Sparkles, // Esthétique
    Dumbbell, // Fitness
    Car, // Garage
    Monitor, // Informatique
    Briefcase, // Consulting
    Calculator, // Comptabilité
    Scale, // Juridique
    ShoppingCart, // Commerce
    Home, // Immobilier
    Heart, // Santé

    // Features
    Calendar, // Planning
    CalendarDays, // Reservations
    Award, // Loyalty
    Mail, // Campaigns
    BarChart3, // Analytics
    CreditCard, // Terminals
    Link, // Payment Links
    Store, // Stores
    Plug, // Integrations
    Plus, // Quick actions
    UserPlus, // Add client
    Truck, // Flotte/Camionnettes
    RotateCcw, // Rachats
};

/**
 * Get icon component by name
 * Returns a default icon if not found
 */
export function getIcon(iconName: string): LucideIcon {
    return ICON_MAP[iconName] || Package;
}
