import { Spinner } from "@/components/ui/spinner";

export interface AuthLoadingStateProps {
    message?: string;
}

export function AuthLoadingState({
    message = "Chargement...",
}: AuthLoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Spinner className="mb-4" />
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );
}
