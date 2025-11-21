"use client";

import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepairEmptyStateProps {
  onCreateClick?: () => void;
}

export function RepairEmptyState({ onCreateClick }: RepairEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-black/10 rounded-lg bg-black/2">
      <div className="p-4 bg-black/5 rounded-full mb-4">
        <Wrench className="h-8 w-8 text-black/40" strokeWidth={2} />
      </div>
      <h3 className="text-[16px] font-semibold text-black mb-2">
        Aucune réparation
      </h3>
      <p className="text-[14px] text-black/60 text-center mb-6 max-w-md">
        Commencez à suivre vos réparations en créant votre premier ticket de
        réparation.
      </p>
      {onCreateClick && (
        <Button
          onClick={onCreateClick}
          className="bg-black hover:bg-black/90 text-white h-11 px-6"
        >
          <Wrench className="h-4 w-4 mr-2" strokeWidth={2} />
          Nouvelle réparation
        </Button>
      )}
    </div>
  );
}
