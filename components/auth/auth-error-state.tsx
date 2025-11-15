import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "./auth-header";
import { AuthFooter } from "./auth-footer";

export interface AuthErrorStateProps {
    title: string;
    description: string;
    error: string;
    submessage?: string;
    onBack: () => void;
    backButtonLabel?: string;
}

export function AuthErrorState({
    title,
    description,
    error,
    submessage,
    onBack,
    backButtonLabel = "Retour à la connexion",
}: AuthErrorStateProps) {
    return (
        <>
            <AuthHeader title={title} description={description} />
            <div className="bg-black/5 border border-black/10 rounded-md p-4">
                <div className="flex items-center gap-3">
                    <AlertCircle
                        className="w-5 h-5 text-black/60"
                        strokeWidth={2}
                    />
                    <div className="flex-1">
                        <p className="text-[14px] font-medium text-black">
                            {error}
                        </p>
                        {submessage && (
                            <p className="text-[13px] text-black/60 mt-1">
                                {submessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Button variant="outline" onClick={onBack} className="w-full">
                {backButtonLabel}
            </Button>
            <AuthFooter />
        </>
    );
}
