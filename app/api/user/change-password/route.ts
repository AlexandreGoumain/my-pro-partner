import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "La confirmation est requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Parser et valider le body
            const body = await req.json();
            const result = changePasswordSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { currentPassword, newPassword } = result.data;

            // Récupérer l'utilisateur avec son mot de passe
            const user = await prisma.user.findUnique({
                where: { id: ctx.userId },
                select: {
                    id: true,
                    password: true,
                },
            });

            if (!user || !user.password) {
                throw new NotFoundError("Utilisateur non trouvé");
            }

            // Vérifier le mot de passe actuel
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new ValidationError("Le mot de passe actuel est incorrect");
            }

            // Hasher le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mettre à jour le mot de passe
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json(
                { message: "Mot de passe modifié avec succès" },
                { status: 200 }
            );
        },
        {
            context: { resourceName: "User", operation: "changePassword" },
        }
    );
}
