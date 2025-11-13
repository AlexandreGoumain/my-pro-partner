import { FullPageErrorState } from "@/components/ui/full-page-error-state";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <FullPageErrorState
            icon={FileQuestion}
            title="Page non trouvée"
            description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
            secondaryAction={{
                label: "Retour à l'accueil",
                href: "/",
            }}
        />
    );
}
