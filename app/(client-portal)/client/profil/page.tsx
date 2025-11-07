"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";

interface ClientProfile {
    nom: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    pays: string;
}

export default function ClientProfilPage() {
    const [profile, setProfile] = useState<ClientProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data.client);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);

        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    telephone: profile.telephone,
                    adresse: profile.adresse,
                    codePostal: profile.codePostal,
                    ville: profile.ville,
                }),
            });

            if (res.ok) {
                toast.success("Profil mis à jour avec succès");
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-24 bg-black/5 rounded-lg" />
                    <div className="h-96 bg-black/5 rounded-lg" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-black/60">
                    Impossible de charger votre profil
                </p>
            </div>
        );
    }

    const nomComplet = `${profile.nom} ${profile.prenom || ""}`.trim();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    Mon profil
                </h1>
                <p className="text-[14px] text-black/60 mt-1">
                    Consultez et modifiez vos informations personnelles
                </p>
            </div>

            {/* Profile Info (Read-Only) */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-6">
                    <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Informations personnelles
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <User
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40">Nom complet</p>
                                <p className="text-[14px] font-medium text-black">
                                    {nomComplet}
                                </p>
                            </div>
                        </div>

                        {profile.email && (
                            <div className="flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                    <Mail
                                        className="h-5 w-5 text-black/60"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <p className="text-[12px] text-black/40">Email</p>
                                    <p className="text-[14px] font-medium text-black">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-black/5">
                        <p className="text-[13px] text-black/60">
                            Pour modifier votre nom ou email, contactez l&apos;entreprise
                        </p>
                    </div>
                </div>
            </Card>

            {/* Editable Contact Info */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-6">
                    <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Coordonnées
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="telephone"
                                className="text-[14px] font-medium text-black"
                            >
                                <Phone
                                    className="h-4 w-4 inline mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                Téléphone
                            </Label>
                            <Input
                                id="telephone"
                                type="tel"
                                value={profile.telephone || ""}
                                onChange={(e) =>
                                    setProfile({ ...profile, telephone: e.target.value })
                                }
                                placeholder="06 12 34 56 78"
                                className="h-11 border-black/10 focus:border-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="adresse"
                                className="text-[14px] font-medium text-black"
                            >
                                <MapPin
                                    className="h-4 w-4 inline mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                Adresse
                            </Label>
                            <Input
                                id="adresse"
                                type="text"
                                value={profile.adresse || ""}
                                onChange={(e) =>
                                    setProfile({ ...profile, adresse: e.target.value })
                                }
                                placeholder="123 rue de la République"
                                className="h-11 border-black/10 focus:border-black"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="codePostal"
                                    className="text-[14px] font-medium text-black"
                                >
                                    Code postal
                                </Label>
                                <Input
                                    id="codePostal"
                                    type="text"
                                    value={profile.codePostal || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            codePostal: e.target.value,
                                        })
                                    }
                                    placeholder="75001"
                                    className="h-11 border-black/10 focus:border-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="ville"
                                    className="text-[14px] font-medium text-black"
                                >
                                    Ville
                                </Label>
                                <Input
                                    id="ville"
                                    type="text"
                                    value={profile.ville || ""}
                                    onChange={(e) =>
                                        setProfile({ ...profile, ville: e.target.value })
                                    }
                                    placeholder="Paris"
                                    className="h-11 border-black/10 focus:border-black"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
