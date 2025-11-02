import {
    Award,
    Clock,
    Filter,
    Mail,
    MapPin,
    Phone,
    Star,
    Users,
    UserX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SEGMENT_ICON_MAP: Record<string, LucideIcon> = {
    Users,
    Mail,
    Phone,
    MapPin,
    Clock,
    UserX,
    Star,
    Award,
    Filter,
};

export const getSegmentIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return Filter;
    return SEGMENT_ICON_MAP[iconName] || Filter;
};
