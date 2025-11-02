import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "@/lib/validation";

export interface LoginPageHandlers {
    form: ReturnType<typeof useForm<LoginInput>>;
    isLoading: boolean;
    error: string | null;
    onSubmit: (data: LoginInput) => Promise<void>;
    handleGoogleSignIn: () => Promise<void>;
}

export function useLoginPage(): LoginPageHandlers {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
                setIsLoading(false);
            } else if (result?.ok) {
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
