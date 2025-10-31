"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    Award,
    BarChart3,
    Building2,
    ChevronRight,
    CreditCard,
    FileText,
    FileUp,
    HelpCircle,
    Keyboard,
    LayoutDashboard,
    LogOut,
    Package,
    Plus,
    Settings,
    User,
    Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items
const items = [
    {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
        items: [
            {
                title: "Liste des clients",
                url: "/dashboard/clients",
            },
            {
                title: "Segments",
                url: "/dashboard/clients/segments",
            },
            {
                title: "Statistiques",
                url: "/dashboard/clients/statistiques",
            },
            {
                title: "Import/Export",
                url: "/dashboard/clients/import-export",
            },
        ],
    },
    {
        title: "Fidélité",
        url: "/dashboard/fidelite",
        icon: Award,
        items: [
            {
                title: "Niveaux de fidélité",
                url: "/dashboard/fidelite/niveaux",
            },
        ],
    },
    {
        title: "Articles",
        url: "/dashboard/articles",
        icon: Package,
        items: [
            {
                title: "Catalogue & Services",
                url: "/dashboard/articles",
            },
            {
                title: "Stock",
                url: "/dashboard/articles/stock",
            },
            {
                title: "Catégories",
                url: "/dashboard/articles/categories",
            },
        ],
    },
    {
        title: "Documents",
        url: "/dashboard/documents",
        icon: FileText,
        items: [
            {
                title: "Devis",
                url: "/dashboard/documents/quotes",
            },
            {
                title: "Factures",
                url: "/dashboard/documents/invoices",
            },
            {
                title: "Avoirs",
                url: "/dashboard/documents/credits",
            },
        ],
    },
    {
        title: "Entreprise",
        url: "/dashboard/entreprise",
        icon: Building2,
    },
    {
        title: "Paramètres",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const userName = session?.user?.name || "Utilisateur";
    const userEmail = session?.user?.email || "";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
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
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        {item.items ? (
                                            <Collapsible
                                                defaultOpen={pathname.startsWith(
                                                    item.url
                                                )}
                                                className="group/collapsible"
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={pathname.startsWith(
                                                            item.url
                                                        )}
                                                        tooltip={item.title}
                                                    >
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items?.map(
                                                            (subItem) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                >
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={
                                                                            pathname ===
                                                                            subItem.url
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.url
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname === item.url}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Création rapide</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/clients/new">
                                            <Plus className="size-4" />
                                            <span>Nouveau client</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/documents/quotes/new">
                                            <Plus className="size-4" />
                                            <span>Nouveau devis</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/documents/invoices/new">
                                            <Plus className="size-4" />
                                            <span>Nouvelle facture</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
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
                                {items.find(
                                    (item) =>
                                        item.url === pathname ||
                                        (item.items &&
                                            item.items.some(
                                                (subItem) =>
                                                    subItem.url === pathname
                                            ))
                                )?.title || "Tableau de bord"}
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
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
