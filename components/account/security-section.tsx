import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface SecuritySectionProps {
    isLoading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SecuritySection({ isLoading, onSubmit }: SecuritySectionProps) {
    return (
        <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                        <Lock
                            className="w-5 h-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Sécurité
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Modifiez votre mot de passe
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="currentPassword"
                            className="text-[14px] font-medium text-black/80"
                        >
                            Mot de passe actuel
                        </Label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            className="h-11 border-black/10 focus:border-black/30"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="newPassword"
                            className="text-[14px] font-medium text-black/80"
                        >
                            Nouveau mot de passe
                        </Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className="h-11 border-black/10 focus:border-black/30"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-[14px] font-medium text-black/80"
                        >
                            Confirmer le nouveau mot de passe
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="h-11 border-black/10 focus:border-black/30"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm"
                    >
                        {isLoading
                            ? "Modification..."
                            : "Changer le mot de passe"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
