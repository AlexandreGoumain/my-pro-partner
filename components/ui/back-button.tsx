"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export interface BackButtonProps {
    label?: string;
    className?: string;
    onClick?: () => void;
}

/**
 * Back button component that navigates to the previous page
 * Uses Next.js router.back() for browser history navigation
 *
 * @example
 * <BackButton />
 * <BackButton label="Retour à la liste" />
 */
export function BackButton({
    label = "Retour",
    className,
    onClick,
}: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className={cn(
                "h-9 px-3 text-[13px] text-black/60 hover:text-black hover:bg-black/5",
                className
            )}
        >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
            {label}
        </Button>
    );
}
