/**
 * Unified Stat Card Component
 * Follows Apple-style minimalist design principles
 * Consolidates multiple stat card patterns into one flexible component
 */

"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  /** Main label for the stat */
  label: string;
  /** Value to display (number or formatted string) */
  value: string | number;
  /** Optional icon to display */
  icon?: LucideIcon;
  /** Layout variant */
  variant?: "default" | "compact" | "large";
  /** Optional percentage change (positive or negative) */
  change?: number;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Icon position */
  iconPosition?: "left" | "right" | "top";
  /** Whether card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether card is in active state */
  active?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  change,
  subtitle,
  iconPosition = "right",
  clickable = false,
  onClick,
  active = false,
  className,
}: StatCardProps) {
  const isPositiveChange = change !== undefined && change >= 0;
  const hasChange = change !== undefined && change !== 0;

  const cardContent = () => {
    // Variant: Large (analytics-style)
    if (variant === "large") {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-black/60">{label}</span>
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
              </div>
            )}
          </div>
          <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
            {value}
          </div>
          {(subtitle || hasChange) && (
            <div className="flex items-center gap-2">
              {hasChange && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-[13px]",
                    isPositiveChange ? "text-black/60" : "text-black/60"
                  )}
                >
                  {isPositiveChange ? (
                    <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
              {subtitle && (
                <span className="text-[13px] text-black/60">{subtitle}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    // Variant: Compact (icon left, horizontal layout)
    if (variant === "compact") {
      return (
        <div className="p-5">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-black/5">
                <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
              </div>
            )}
            <div className="flex-1">
              <p className="text-[13px] text-black/40">{label}</p>
              <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                {value}
              </p>
            </div>
            {hasChange && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[12px] px-2 py-1 rounded-md bg-black/5",
                  "text-black/60"
                )}
              >
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" strokeWidth={2} />
                ) : (
                  <TrendingDown className="h-3 w-3" strokeWidth={2} />
                )}
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-[12px] text-black/40 mt-2">{subtitle}</p>
          )}
        </div>
      );
    }

    // Variant: Default (flexible layout based on iconPosition)
    if (iconPosition === "left") {
      return (
        <div className="p-5">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-black/5">
                <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
              </div>
            )}
            <div className="flex-1">
              <p className="text-[13px] text-black/40 mb-1">{label}</p>
              <p className="text-[22px] font-semibold tracking-[-0.01em] text-black">
                {value}
              </p>
              {subtitle && (
                <p className="text-[12px] text-black/40 mt-1">{subtitle}</p>
              )}
            </div>
            {hasChange && (
              <div className="flex flex-col items-end">
                <div
                  className={cn(
                    "flex items-center gap-1 text-[13px]",
                    "text-black/60"
                  )}
                >
                  {isPositiveChange ? (
                    <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Icon on right (default)
    return (
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[13px] text-black/40 mb-1">{label}</p>
            <p className="text-[22px] font-semibold tracking-[-0.01em] text-black">
              {value}
            </p>
            {(subtitle || hasChange) && (
              <div className="flex items-center gap-2 mt-1">
                {hasChange && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[12px]",
                      "text-black/60"
                    )}
                  >
                    {isPositiveChange ? (
                      <TrendingUp className="h-3 w-3" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="h-3 w-3" strokeWidth={2} />
                    )}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
                {subtitle && (
                  <span className="text-[12px] text-black/40">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-black/5">
              <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "border-black/8 shadow-sm",
        clickable && "cursor-pointer transition-all duration-200",
        clickable && "hover:shadow-md hover:border-black/15",
        active && "border-black/20 bg-black/2",
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {cardContent()}
    </Card>
  );
}
