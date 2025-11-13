interface InvitationSuccessBannerProps {
    className?: string;
}

export function InvitationSuccessBanner({
    className,
}: InvitationSuccessBannerProps) {
    return (
        <div
            className={`rounded-lg bg-black/5 border border-black/10 p-4 ${className || ""}`}
        >
            <p className="text-[14px] text-black/80">
                ✓ Vous avez été invité(e) à créer un compte.
            </p>
            <p className="text-[13px] text-black/60 mt-1">
                Seuls les champs marqués d&apos;un * sont obligatoires. Vous
                pourrez compléter votre profil plus tard.
            </p>
        </div>
    );
}
