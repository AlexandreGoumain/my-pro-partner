"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CreditCard, Keyboard, LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface UserDropdownMenuProps {
    userName: string;
    userEmail: string;
    userInitials: string;
    avatarUrl?: string | null;
}

export function UserDropdownMenu({
    userName,
    userEmail,
    userInitials,
    avatarUrl,
}: UserDropdownMenuProps) {
    const router = useRouter();
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    const handleProfile = () => {
        // Redirige vers l'onglet "account" dans les paramètres
        router.push("/dashboard/settings?tab=account");
    };

    const handleBilling = () => {
        // Redirige vers l'onglet "subscription" dans les paramètres
        router.push("/dashboard/settings?tab=subscription");
    };

    const handleSettings = () => {
        // Redirige vers l'onglet "general" par défaut
        router.push("/dashboard/settings");
    };

    const handleKeyboardShortcuts = () => {
        // TODO: Ouvrir une modal avec les raccourcis clavier
        alert("Raccourcis clavier - À implémenter");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-black/5 transition-all duration-200"
                >
                    <UserAvatar
                        src={avatarUrl}
                        alt={userName}
                        fallback={userInitials}
                        className="h-9 w-9 cursor-pointer border border-black/10"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-64 bg-white border-black/10 shadow-sm"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal px-3 py-2.5">
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-[14px] font-semibold text-black">
                            {userName}
                        </p>
                        <p className="text-[12px] text-black/50">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/8" />

                <DropdownMenuItem
                    onClick={handleProfile}
                    className="px-3 py-2.5 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200"
                >
                    <User
                        className="mr-3 h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/80">
                        Mon profil
                    </span>
                    <DropdownMenuShortcut className="text-[11px] text-black/40">
                        ⇧⌘P
                    </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleBilling}
                    className="px-3 py-2.5 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200"
                >
                    <CreditCard
                        className="mr-3 h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/80">
                        Facturation
                    </span>
                    <DropdownMenuShortcut className="text-[11px] text-black/40">
                        ⌘B
                    </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleSettings}
                    className="px-3 py-2.5 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200"
                >
                    <Settings
                        className="mr-3 h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/80">
                        Paramètres
                    </span>
                    <DropdownMenuShortcut className="text-[11px] text-black/40">
                        ⌘S
                    </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleKeyboardShortcuts}
                    className="px-3 py-2.5 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200"
                >
                    <Keyboard
                        className="mr-3 h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/80">
                        Raccourcis clavier
                    </span>
                    <DropdownMenuShortcut className="text-[11px] text-black/40">
                        ⌘K
                    </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-black/8" />

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="px-3 py-2.5 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200"
                >
                    <LogOut
                        className="mr-3 h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/80">
                        Se déconnecter
                    </span>
                    <DropdownMenuShortcut className="text-[11px] text-black/40">
                        ⇧⌘Q
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
