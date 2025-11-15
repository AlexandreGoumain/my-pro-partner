"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface UserAvatarProps
    extends React.ComponentPropsWithoutRef<typeof Avatar> {
    src?: string | null;
    alt?: string;
    fallback?: string;
}

export function UserAvatar({
    src,
    alt,
    fallback,
    className,
    ...props
}: UserAvatarProps) {
    const initials = React.useMemo(() => {
        if (fallback) return fallback;
        if (alt) {
            return alt
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2);
        }
        return "U";
    }, [alt, fallback]);

    return (
        <Avatar className={className} {...props}>
            <AvatarImage src={src || undefined} alt={alt} />
            <AvatarFallback className="text-sm font-medium">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}

export { Avatar, AvatarFallback, AvatarImage };
