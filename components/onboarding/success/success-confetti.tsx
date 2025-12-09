"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
}

/**
 * Animation de confetti subtile et élégante
 * Style Apple : noir/gris uniquement, animation fluide
 */
export function SuccessConfetti() {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Générer les pièces de confetti
        const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            duration: 2 + Math.random() * 2,
            size: 4 + Math.random() * 8,
        }));
        setPieces(newPieces);

        // Masquer après l'animation
        const timer = setTimeout(() => setIsVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${piece.x}%`,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                >
                    <div
                        className="rounded-full bg-black/20"
                        style={{
                            width: piece.size,
                            height: piece.size,
                        }}
                    />
                </div>
            ))}

            <style jsx>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-20px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                .animate-confetti-fall {
                    animation: confetti-fall linear forwards;
                }
            `}</style>
        </div>
    );
}
