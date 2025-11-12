import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientProfile, ClientProfileUpdate } from "@/lib/types/profile";
import { cn } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";

export interface ProfileFormCardProps {
    profile: ClientProfile;
    isSaving: boolean;
    onSave: (data: ClientProfileUpdate) => Promise<void>;
    className?: string;
}

export function ProfileFormCard({
    profile,
    isSaving,
    onSave,
    className,
}: ProfileFormCardProps) {
    const [formData, setFormData] = useState<ClientProfileUpdate>({
        telephone: profile.telephone || "",
        adresse: profile.adresse || "",
        codePostal: profile.codePostal || "",
        ville: profile.ville || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
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
                            value={formData.telephone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    telephone: e.target.value,
                                })
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
                            value={formData.adresse}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    adresse: e.target.value,
                                })
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
                                value={formData.codePostal}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
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
                                value={formData.ville}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ville: e.target.value,
                                    })
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
                        {isSaving
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                    </Button>
                </form>
            </div>
        </Card>
    );
}
