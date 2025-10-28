import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="mx-auto max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-3">
                        <FileQuestion className="h-10 w-10 text-muted-foreground" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-bold tracking-tight">404</h1>
                    <h2 className="text-2xl font-semibold">Page non trouvée</h2>
                    <p className="text-muted-foreground">
                        Désolé, la page que vous recherchez n&apos;existe pas ou
                        a été déplacée.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Link href="/">
                        <Button>Retour à l&apos;accueil</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
