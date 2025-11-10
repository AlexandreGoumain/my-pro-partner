"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthError, AuthFooter, AuthHeader } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const acceptInvitationSchema = z
  .object({
    name: z.string().optional(),
    prenom: z.string().optional(),
    telephone: z.string().optional(),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;

interface InvitationData {
  email: string;
  name?: string;
  prenom?: string;
  role: string;
  entrepriseName: string;
  expiresAt: string;
}

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);

  const form = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      name: "",
      prenom: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Token d'invitation manquant");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/team/accept-invitation?token=${token}`,
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Invitation invalide");
          setIsVerifying(false);
          return;
        }

        if (data.valid && data.invitation) {
          setInvitation(data.invitation);
          // Pré-remplir les champs si disponibles
          if (data.invitation.name) {
            form.setValue("name", data.invitation.name);
          }
          if (data.invitation.prenom) {
            form.setValue("prenom", data.invitation.prenom);
          }
        } else {
          setError("Invitation invalide");
        }
      } catch (err) {
        console.error("Error verifying invitation:", err);
        setError("Erreur lors de la vérification de l'invitation");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, form]);

  const onSubmit = async (data: AcceptInvitationFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/team/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || "Erreur lors de l'acceptation de l'invitation",
        );
        setIsLoading(false);
        return;
      }

      setSuccess(true);

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Erreur lors de l'acceptation de l'invitation");
      setIsLoading(false);
    }
  };

  // État de chargement
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="mb-4" />
        <p className="text-[14px] text-black/60">
          Vérification de l'invitation...
        </p>
      </div>
    );
  }

  // Invitation invalide
  if (error && !invitation) {
    return (
      <>
        <AuthHeader
          title="Invitation invalide"
          description="L'invitation que vous essayez d'utiliser n'est pas valide"
        />
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-red-900">{error}</p>
              <p className="text-[13px] text-red-700 mt-1">
                Cette invitation a peut-être expiré ou a déjà été utilisée.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/login")}
          className="w-full"
        >
          Retour à la connexion
        </Button>
        <AuthFooter />
      </>
    );
  }

  // Succès
  if (success) {
    return (
      <>
        <AuthHeader
          title="Compte créé avec succès !"
          description="Vous allez être redirigé vers la page de connexion"
        />
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-green-900">
                Votre compte a été créé avec succès !
              </p>
              <p className="text-[13px] text-green-700 mt-1">
                Vous pouvez maintenant vous connecter avec votre email et mot de
                passe.
              </p>
            </div>
          </div>
        </div>
        <AuthFooter />
      </>
    );
  }

  // Formulaire d'acceptation
  return (
    <>
      <AuthHeader
        title="Accepter l'invitation"
        description={`Rejoignez ${invitation?.entrepriseName || "l'équipe"}`}
      />

      {invitation && (
        <div className="bg-black/5 border border-black/10 rounded-md p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-black/40">Email</span>
              <span className="text-[14px] font-medium text-black">
                {invitation.email}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-black/40">Rôle</span>
              <span className="text-[14px] font-medium text-black">
                {invitation.role}
              </span>
            </div>
          </div>
        </div>
      )}

      <AuthError error={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Jean"
                      disabled={isLoading}
                      className={cn(
                        "transition-all",
                        form.formState.errors.prenom && "border-destructive",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Dupont"
                      disabled={isLoading}
                      className={cn(
                        "transition-all",
                        form.formState.errors.name && "border-destructive",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="06 12 34 56 78"
                    disabled={isLoading}
                    className={cn(
                      "transition-all",
                      form.formState.errors.telephone && "border-destructive",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={cn(
                      "transition-all",
                      form.formState.errors.password && "border-destructive",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={cn(
                      "transition-all",
                      form.formState.errors.confirmPassword &&
                        "border-destructive",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Création du compte...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>
      </Form>

      <AuthFooter />
    </>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Spinner className="mb-4" />
          <p className="text-[14px] text-black/60">Chargement...</p>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
