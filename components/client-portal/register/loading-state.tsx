interface LoadingStateProps {
    message?: string;
}

export function LoadingState({
    message = "Chargement...",
}: LoadingStateProps) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );
}
