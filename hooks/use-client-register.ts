import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
    ClientRegisterData,
    UseClientRegisterReturn,
} from "@/lib/types/auth";

export function useClientRegister(): UseClientRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const register = useCallback(
    async (data: ClientRegisterData): Promise<boolean> => {
      // Validation
      if (!data.nom || !data.email || !data.telephone || !data.password) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return false;
      }

      if (data.password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return false;
      }

      if (!data.invitationToken) {
        toast.error("Invitation invalide");
        return false;
      }

      setIsLoading(true);
      setSuccess(false);

      try {
        const res = await fetch("/api/client/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
          toast.error(responseData.message || "Erreur lors de l'inscription");
          return false;
        }

        setSuccess(true);
        toast.success(responseData.message);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/client/login");
        }, 2000);

        return true;
      } catch (error) {
        console.error("[useClientRegister] Error:", error);
        toast.error("Erreur lors de l'inscription");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    isLoading,
    success,
    register,
  };
}
