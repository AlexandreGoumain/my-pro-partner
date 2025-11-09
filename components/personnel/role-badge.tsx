/**
 * Badge pour afficher le rôle d'un utilisateur
 */

import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/hooks/personnel/use-personnel";
import { ROLE_LABELS } from "@/lib/personnel/roles-config";
import { Shield, UserCog, Users, User, CreditCard, Calculator } from "lucide-react";

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

const ROLE_COLORS: Record<UserRole, string> = {
  OWNER: "bg-purple-100 text-purple-800 border-purple-200",
  ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
  MANAGER: "bg-green-100 text-green-800 border-green-200",
  EMPLOYEE: "bg-gray-100 text-gray-800 border-gray-200",
  CASHIER: "bg-orange-100 text-orange-800 border-orange-200",
  ACCOUNTANT: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const ROLE_ICONS: Record<UserRole, any> = {
  OWNER: Shield,
  ADMIN: UserCog,
  MANAGER: Users,
  EMPLOYEE: User,
  CASHIER: CreditCard,
  ACCOUNTANT: Calculator,
};

export function RoleBadge({ role, showIcon = true }: RoleBadgeProps) {
  const Icon = ROLE_ICONS[role];

  return (
    <Badge className={`${ROLE_COLORS[role]} border font-medium text-[11px]`} variant="outline">
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {ROLE_LABELS[role]}
    </Badge>
  );
}
