"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatbotProvider } from "@/lib/chatbot/chatbot-context";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    ChevronRight,
    CreditCard,
    HelpCircle,
    Keyboard,
    LogOut,
    Settings,
    User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBusinessNavigation } from "@/hooks/use-business-navigation";
import { getIcon } from "@/lib/navigation/utils/icon-map";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Get business-adapted navigation
    const { navigation, isLoading: navLoading } = useBusinessNavigation();

    const userName = session?.user?.name || "Utilisateur";
    const userEmail = session?.user?.email || "";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <ChatbotProvider>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-lg font-bold">MP</span>
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                MyProPartner
                            </span>
                            <span className="truncate text-xs">
                                ERP Artisan
                            </span>
                        </div>
                    </SidebarMenuButton>
                </SidebarHeader>
                <SidebarContent>
                    {navLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Spinner className="h-6 w-6" />
                        </div>
                    ) : (
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel>Application</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {navigation?.items.map((item) => {
                                            const Icon = getIcon(item.icon);
                                            return (
                                                <SidebarMenuItem key={item.key}>
                                                    {item.items && item.items.length > 0 ? (
                                                        <Collapsible
                                                            defaultOpen={pathname.startsWith(
                                                                item.href
                                                            )}
                                                            className="group/collapsible"
                                                        >
                                                            <CollapsibleTrigger asChild>
                                                                <SidebarMenuButton
                                                                    isActive={pathname.startsWith(
                                                                        item.href
                                                                    )}
                                                                    tooltip={item.label}
                                                                >
                                                                    <Icon />
                                                                    <span>{item.label}</span>
                                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                                </SidebarMenuButton>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                                <SidebarMenuSub>
                                                                    {item.items.map((subItem) => (
                                                                        <SidebarMenuSubItem key={subItem.key}>
                                                                            <SidebarMenuSubButton
                                                                                asChild
                                                                                isActive={pathname === subItem.href}
                                                                            >
                                                                                <Link href={subItem.href}>
                                                                                    <span>{subItem.label}</span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    ))}
                                                                </SidebarMenuSub>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    ) : (
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={pathname === item.href}
                                                            tooltip={item.label}
                                                        >
                                                            <Link href={item.href}>
                                                                <Icon />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    )}
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            {navigation?.quickActions && navigation.quickActions.length > 0 && (
                                <SidebarGroup>
                                    <SidebarGroupLabel>Création rapide</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {navigation.quickActions.map((action) => {
                                                const Icon = getIcon(action.icon);
                                                return (
                                                    <SidebarMenuItem key={action.key}>
                                                        <SidebarMenuButton asChild>
                                                            <Link href={action.href}>
                                                                <Icon className="size-4" />
                                                                <span>{action.label}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            )}
                        </>
                    )}
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <HelpCircle />
                                    <span>Aide & Support</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold">
                                {navigation?.items.find(
                                    (item) =>
                                        item.href === pathname ||
                                        (item.items &&
                                            item.items.some(
                                                (subItem) =>
                                                    subItem.href === pathname
                                            ))
                                )?.label || "Tableau de bord"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar className="h-10 w-10 cursor-pointer">
                                            <AvatarImage
                                                src="/avatars/01.png"
                                                alt={userName}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {userName}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {userEmail}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Mon profil</span>
                                        <DropdownMenuShortcut>
                                            ⇧⌘P
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        <span>Facturation</span>
                                        <DropdownMenuShortcut>
                                            ⌘B
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Paramètres</span>
                                        <DropdownMenuShortcut>
                                            ⌘S
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Keyboard className="mr-2 h-4 w-4" />
                                        <span>Raccourcis clavier</span>
                                        <DropdownMenuShortcut>
                                            ⌘K
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() =>
                                            signOut({
                                                callbackUrl: "/auth/login",
                                            })
                                        }
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Se déconnecter</span>
                                        <DropdownMenuShortcut>
                                            ⇧⌘Q
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 bg-black/[0.04]">{children}</div>
                <ChatbotWidget />
            </SidebarInset>
        </SidebarProvider>
        </ChatbotProvider>
    );
}
