import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Bloquer l'accès au dashboard en production si pas encore lancé
  const isDashboardEnabled = process.env.NEXT_PUBLIC_DASHBOARD_ENABLED === "true";

  if (!isDashboardEnabled) {
    // Rediriger vers la waitlist
    redirect("/waitlist");
  }

  // Vérifier l'authentification
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
