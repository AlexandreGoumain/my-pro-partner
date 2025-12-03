// ==============================================
// TESTS DE COMPOSANT - components/ui/badge.tsx
// ==============================================
// Ce fichier montre comment tester des composants React.
// On utilise @testing-library/react pour "rendre" le composant et interagir avec.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

// ==============================================
// Tests de rendu basique
// ==============================================
describe("Badge", () => {
    it("rend le texte passé en children", () => {
        // render() = Monte le composant dans le DOM virtuel
        render(<Badge>Hello</Badge>);

        // screen.getByText() = Cherche un élément par son texte
        // Si l'élément n'existe pas, le test échoue automatiquement
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("applique la classe variant par défaut", () => {
        render(<Badge>Default</Badge>);

        const badge = screen.getByText("Default");
        // toHaveClass() = Vérifie qu'un élément a une classe CSS
        expect(badge).toHaveClass("bg-primary");
    });

    it("applique la variante secondary", () => {
        render(<Badge variant="secondary">Secondary</Badge>);

        const badge = screen.getByText("Secondary");
        expect(badge).toHaveClass("bg-secondary");
    });

    it("applique la variante destructive", () => {
        render(<Badge variant="destructive">Error</Badge>);

        const badge = screen.getByText("Error");
        expect(badge).toHaveClass("bg-destructive");
    });

    it("applique la variante outline", () => {
        render(<Badge variant="outline">Outline</Badge>);

        const badge = screen.getByText("Outline");
        expect(badge).toHaveClass("text-foreground");
    });

    it("accepte des classes CSS additionnelles", () => {
        render(<Badge className="custom-class">Custom</Badge>);

        const badge = screen.getByText("Custom");
        expect(badge).toHaveClass("custom-class");
    });

    it("a le data-slot='badge' pour le styling", () => {
        render(<Badge>Slotted</Badge>);

        const badge = screen.getByText("Slotted");
        // toHaveAttribute() = Vérifie qu'un élément a un attribut
        expect(badge).toHaveAttribute("data-slot", "badge");
    });

    it("rend comme un span par défaut", () => {
        render(<Badge>Span Badge</Badge>);

        const badge = screen.getByText("Span Badge");
        // tagName est en majuscules
        expect(badge.tagName).toBe("SPAN");
    });

    it("peut rendre comme un autre élément avec asChild", () => {
        render(
            <Badge asChild>
                <a href="#">Link Badge</a>
            </Badge>
        );

        const badge = screen.getByText("Link Badge");
        expect(badge.tagName).toBe("A");
        expect(badge).toHaveAttribute("href", "#");
    });
});
