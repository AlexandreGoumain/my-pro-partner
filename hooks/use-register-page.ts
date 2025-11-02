import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/lib/validation";

export interface RegisterPageHandlers {
    form: ReturnType<typeof useForm<RegisterInput>>;
    isLoading: boolean;
    error: string | null;
    onSubmit: (data: RegisterInput) => Promise<void>;
    handleGoogleSignIn: () => Promise<void>;
}

export function useRegisterPage(): RegisterPageHandlers {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Erreur lors de l'inscription");
                setIsLoading(false);
                return;
            }

            // Connexion automatique après inscription
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setError(signInResult.error);
                setIsLoading(false);
            } else if (signInResult?.ok) {
                router.push("/dashboard");
            }
        } catch {
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch {
            setError("Erreur lors de la connexion avec Google");
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        error,
        onSubmit,
        handleGoogleSignIn,
    };
}
