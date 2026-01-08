import { QueryProvider } from "@/components/providers/query-provider";
import { NextAuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "My Pro Partner",
        template: "%s | My Pro Partner",
    },
    description:
        "La solution ERP tout-en-un pour gérer votre entreprise simplement. Gestion clients, facturation, stock et analytics.",
    keywords: ["ERP", "gestion", "facturation", "clients", "artisan", "PME"],
    authors: [{ name: "My Pro Partner" }],
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "My Pro Partner",
        description:
            "La solution ERP tout-en-un pour gérer votre entreprise simplement.",
        type: "website",
        locale: "fr_FR",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>
                    <NextAuthProvider>{children}</NextAuthProvider>
                    <Toaster />
                </QueryProvider>
            </body>
        </html>
    );
}
