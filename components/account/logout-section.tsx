import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogOut } from "lucide-react";

interface LogoutSectionProps {
    onSignOut: () => void;
}

export function LogoutSection({ onSignOut }: LogoutSectionProps) {
    return (
        <Card className="border-red-200 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <LogOut
                            className="w-5 h-5 text-red-600"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Déconnexion
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Quitter votre session actuelle
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={onSignOut}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 h-11 px-6 text-[14px] font-medium"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                </Button>
            </CardContent>
        </Card>
    );
}
