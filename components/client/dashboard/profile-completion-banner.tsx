import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

export interface ProfileCompletionBannerProps {
    onDismiss: () => void;
    className?: string;
}

export function ProfileCompletionBanner({
    onDismiss,
    className,
}: ProfileCompletionBannerProps) {
    return (
        <Card
            className={cn(
                "border-black/10 shadow-sm bg-black/[0.02] animate-in slide-in-from-top-2 duration-300",
                className
            )}
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                        <UserCircle
                            className="h-5 w-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold text-black mb-1">
                            Complétez votre profil
                        </h3>
                        <p className="text-[14px] text-black/60 mb-3">
                            Ajoutez vos informations de contact pour faciliter
                            vos échanges.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/client/profil">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-4 text-[13px] font-medium border-black/10 hover:bg-black/5"
                                >
                                    Compléter mon profil
                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDismiss}
                                className="h-9 px-4 text-[13px] text-black/50 hover:text-black/80"
                            >
                                Plus tard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
