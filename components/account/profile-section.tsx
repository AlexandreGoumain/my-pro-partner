import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User } from "lucide-react";

interface ProfileSectionProps {
    profile: {
        name: string;
        email: string;
    };
    setProfileName: (name: string) => void;
    setProfileEmail: (email: string) => void;
    hasProfileChanged: boolean;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfileSection({
    profile,
    setProfileName,
    setProfileEmail,
    hasProfileChanged,
    isLoading,
    onSubmit,
}: ProfileSectionProps) {
    return (
        <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                        <User
                            className="w-5 h-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Informations personnelles
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Modifiez vos informations de profil
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-[14px] font-medium text-black/80"
                        >
                            Nom complet
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="h-11 border-black/10 focus:border-black/30"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-[14px] font-medium text-black/80"
                        >
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-black/40" />
                                Email
                            </div>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="h-11 border-black/10 focus:border-black/30"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !hasProfileChanged}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
