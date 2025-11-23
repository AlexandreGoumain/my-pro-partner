"use client";

import { useState } from "react";
import type { Reparation } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RefreshCcw } from "lucide-react";
import { RepairStatusChangeDialog } from "./repair-status-change-dialog";

export interface RepairStatusActionButtonProps {
  reparation: Reparation;
  onSuccess?: () => void;
  variant?: "default" | "outline";
  className?: string;
}

export function RepairStatusActionButton({
  reparation,
  onSuccess,
  variant = "default",
  className,
}: RepairStatusActionButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  if (variant === "outline") {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={className}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Changer le statut
        </Button>
        <RepairStatusChangeDialog
          reparation={reparation}
          open={open}
          onOpenChange={setOpen}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return (
    <>
      <PrimaryActionButton
        onClick={() => setOpen(true)}
        className={className}
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Changer le statut
      </PrimaryActionButton>
      <RepairStatusChangeDialog
        reparation={reparation}
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
