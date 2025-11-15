import { CheckCircle2 } from "lucide-react";
import { AuthHeader } from "./auth-header";
import { AuthFooter } from "./auth-footer";

export interface AuthSuccessStateProps {
    title: string;
    description: string;
    message: string;
    submessage?: string;
}

export function AuthSuccessState({
    title,
    description,
    message,
    submessage,
}: AuthSuccessStateProps) {
    return (
        <>
            <AuthHeader title={title} description={description} />
            <div className="bg-black/5 border border-black/10 rounded-md p-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2
                        className="w-5 h-5 text-black/60"
                        strokeWidth={2}
                    />
                    <div className="flex-1">
                        <p className="text-[14px] font-medium text-black">
                            {message}
                        </p>
                        {submessage && (
                            <p className="text-[13px] text-black/60 mt-1">
                                {submessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <AuthFooter />
        </>
    );
}
