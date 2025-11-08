/**
 * Badge pour afficher le statut d'un utilisateur
 */

import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/hooks/personnel/use-personnel";
import { STATUS_LABELS } from "@/lib/personnel/roles-config";
import { CheckCircle2, XCircle, Ban, Mail } from "lucide-react";

interface StatusBadgeProps {
  status: UserStatus;
  showIcon?: boolean;
}

const STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
  SUSPENDED: "bg-red-100 text-red-800 border-red-200",
  INVITED: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const STATUS_ICONS: Record<UserStatus, any> = {
  ACTIVE: CheckCircle2,
  INACTIVE: XCircle,
  SUSPENDED: Ban,
  INVITED: Mail,
};

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status];

  return (
    <Badge className={`${STATUS_COLORS[status]} border font-medium text-[11px]`} variant="outline">
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {STATUS_LABELS[status]}
    </Badge>
  );
}
