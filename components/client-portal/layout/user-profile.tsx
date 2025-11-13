"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface UserProfileProps {
    clientName: string;
    initials: string;
    onLogout: () => void;
    className?: string;
}

/**
 * User profile section for sidebar
 * Displays avatar, name, and logout button
 */
export function UserProfile({
    clientName,
    initials,
    onLogout,
    className,
}: UserProfileProps) {
    return (
        <div className={`p-4 border-t border-black/8 ${className || ""}`}>
            <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-black/10">
                    <AvatarFallback className="bg-black text-white text-[14px] font-semibold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-black truncate">
                        {clientName || "Client"}
                    </p>
                    <p className="text-[12px] text-black/40">Portail Client</p>
                </div>
            </div>
            <Button
                onClick={onLogout}
                variant="outline"
                className="w-full h-9 text-[13px] font-medium border-black/10 hover:bg-black/5"
            >
                <LogOut className="h-4 w-4 mr-2" strokeWidth={2} />
                Se déconnecter
            </Button>
        </div>
    );
}
