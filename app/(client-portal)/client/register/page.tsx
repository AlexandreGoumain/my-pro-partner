"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserPlus, CheckCircle } from "lucide-react";
import { useClientRegister } from "@/hooks/use-client-register";
import { useInvitationVerification } from "@/hooks/use-invitation-verification";
import { useRegisterForm } from "@/hooks/use-register-form";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("token") || "";

  const { register, isLoading, success } = useClientRegister();
  const { invitationData, isVerifying, error: invitationError } =
    useInvitationVerification(invitationToken);
  const {
    formData,
    errors,
    handleChange,
    setFormData,
    setErrors,
    validateForm,
  } = useRegisterForm();

  // Pre-fill form with invitation data
  useEffect(() => {
    if (invitationData) {
      setFormData((prev) => ({
        ...prev,
        email: invitationData.email || "",
        nom: invitationData.nom || "",
        prenom: invitationData.prenom || "",
        telephone: invitationData.telephone || "",
      }));
    }
  }, [invitationData, setFormData]);

  // Update invitation error in form errors
  useEffect(() => {
    if (invitationError) {
      setErrors((prev) => ({ ...prev, invitation: invitationError }));
    }
  }, [invitationError, setErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate invitation
    if (!invitationData || !invitationToken) {
      setErrors((prev) => ({
        ...prev,
        invitation: "Invitation invalide",
      }));
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Register client
    await register({
      nom: formData.nom,
      prenom: formData.prenom || undefined,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
      adresse: formData.adresse || undefined,
      codePostal: formData.codePostal || undefined,
      ville: formData.ville || undefined,
      invitationToken: invitationToken,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-black/8 shadow-sm p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
            </div>
            <div>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                Compte créé avec succès !
              </h2>
              <p className="text-[15px] text-black/60">
                Vous pouvez maintenant vous connecter à votre espace client.
              </p>
            </div>
            <Button
              onClick={() => router.push("/client/login")}
              className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
            >
              Se connecter
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="text-[14px] text-black/60">
          Vérification de l&apos;invitation...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-2">
            {invitationData
              ? `Bienvenue chez ${invitationData?.entrepriseName}`
              : "Créer votre compte"}
          </h1>
          <p className="text-[15px] text-black/60">
            {invitationData
              ? "Complétez votre inscription pour accéder à votre espace client"
              : "Vous devez être invité pour créer un compte"}
          </p>
        </div>

        {/* Register Form */}
        <Card className="border-black/8 shadow-sm">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {invitationData && (
                <div className="rounded-lg bg-black/5 border border-black/10 p-4">
                  <p className="text-[14px] text-black/80">
                    ✓ Vous avez été invité(e) à créer un compte. Certaines
                    informations sont pré-remplies.
                  </p>
                </div>
              )}

              {errors.invitation && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-[14px] text-red-800">
                    {errors.invitation}
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[14px] font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  disabled={!!invitationData?.email}
                  className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-[14px] font-medium">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  disabled={!!invitationData?.nom}
                  className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-[14px] font-medium">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  disabled={!!invitationData?.prenom}
                  className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-[14px] font-medium">
                  Téléphone *
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  required
                  disabled={!!invitationData?.telephone}
                  className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-[14px] font-medium">
                  Adresse
                </Label>
                <Input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="123 rue de la République"
                  className="h-11 border-black/10 focus:border-black"
                />
              </div>

              {/* Code postal & Ville */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="codePostal"
                    className="text-[14px] font-medium"
                  >
                    Code postal
                  </Label>
                  <Input
                    id="codePostal"
                    name="codePostal"
                    type="text"
                    value={formData.codePostal}
                    onChange={handleChange}
                    placeholder="75001"
                    className="h-11 border-black/10 focus:border-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ville" className="text-[14px] font-medium">
                    Ville
                  </Label>
                  <Input
                    id="ville"
                    name="ville"
                    type="text"
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="h-11 border-black/10 focus:border-black"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[14px] font-medium">
                  Mot de passe *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-11 border-black/10 focus:border-black"
                />
                {errors.password ? (
                  <p className="text-[12px] text-red-600">{errors.password}</p>
                ) : (
                  <p className="text-[12px] text-black/40">
                    8 caractères minimum
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[14px] font-medium"
                >
                  Confirmer le mot de passe *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-11 border-black/10 focus:border-black"
                />
                {errors.confirmPassword && (
                  <p className="text-[12px] text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || isVerifying || !invitationData}
                className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
              >
                {isLoading ? (
                  "Inscription..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[13px] text-black/40">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/client/login"
                  className="text-black/60 hover:text-black transition-colors font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ClientRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <p className="text-[14px] text-black/60">Chargement...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
