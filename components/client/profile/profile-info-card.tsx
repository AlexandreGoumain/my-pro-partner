import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, User } from "lucide-react";

export interface ProfileInfoCardProps {
    nomComplet: string;
    email?: string;
    className?: string;
}

export function ProfileInfoCard({
    nomComplet,
    email,
    className,
}: ProfileInfoCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
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
                            <p className="text-[12px] text-black/40">
                                Nom complet
                            </p>
                            <p className="text-[14px] font-medium text-black">
                                {nomComplet}
                            </p>
                        </div>
                    </div>

                    {email && (
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Mail
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40">
                                    Email
                                </p>
                                <p className="text-[14px] font-medium text-black">
                                    {email}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-black/5">
                    <p className="text-[13px] text-black/60">
                        Pour modifier votre nom ou email, contactez
                        l&apos;entreprise
                    </p>
                </div>
            </div>
        </Card>
    );
}
