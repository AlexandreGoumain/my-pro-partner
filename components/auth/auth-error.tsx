export interface AuthErrorProps {
    error: string | null;
}

export function AuthError({ error }: AuthErrorProps) {
    if (!error) return null;

    return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
        </div>
    );
}
