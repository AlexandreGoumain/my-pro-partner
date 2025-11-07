"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Award, FileText, Home, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export default function ClientPortalLayout({
  children,
}: ClientPortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [clientName, setClientName] = useState<string>("");
  const [initials, setInitials] = useState<string>("C");

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token && !pathname.startsWith("/client/login")) {
      router.push("/client/login");
      return;
    }

    // Fetch client info
    if (token) {
      fetchClientInfo(token);
    }
  }, [pathname, router]);

  const fetchClientInfo = async (token: string) => {
    try {
      const res = await fetch("/api/client/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const client = data.client;
        const fullName = `${client.nom} ${client.prenom || ""}`.trim();
        setClientName(fullName);
        setInitials(
          `${client.nom.charAt(0)}${client.prenom?.charAt(0) || ""}`.toUpperCase(),
        );
      } else {
        // Token invalid, redirect to login
        localStorage.removeItem("clientToken");
        if (!pathname.startsWith("/client/login")) {
          router.push("/client/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch client info:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    router.push("/client/login");
  };

  const navigation = [
    {
      name: "Tableau de bord",
      href: "/client/dashboard",
      icon: Home,
    },
    {
      name: "Fidélité",
      href: "/client/fidelite",
      icon: Award,
    },
    {
      name: "Mes documents",
      href: "/client/documents",
      icon: FileText,
    },
    {
      name: "Mon profil",
      href: "/client/profil",
      icon: User,
    },
  ];

  // Don't show layout on login page
  if (pathname.startsWith("/client/login")) {
    return (
      <html lang="fr">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex h-screen bg-white">
          {/* Sidebar */}
          <div className="w-64 border-r border-black/8 flex flex-col">
            {/* Logo / Header */}
            <div className="h-16 border-b border-black/8 flex items-center px-6">
              <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                Portail Client
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-black/60 hover:bg-black/5 hover:text-black"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-black/8">
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
                onClick={handleLogout}
                variant="outline"
                className="w-full h-9 text-[13px] font-medium border-black/10 hover:bg-black/5"
              >
                <LogOut className="h-4 w-4 mr-2" strokeWidth={2} />
                Se déconnecter
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <main className="p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
