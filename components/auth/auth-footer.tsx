import Link from "next/link";

export function AuthFooter() {
    return (
        <p className="px-8 text-center text-xs text-muted-foreground">
            En cliquant sur continuer, vous acceptez nos{" "}
            <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
            >
                Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
            >
                Politique de confidentialité
            </Link>
            .
        </p>
    );
}
