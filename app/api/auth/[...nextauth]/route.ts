import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { entreprise: true },
                });

                if (!user) {
                    throw new Error("Utilisateur non trouvé");
                }

                if (!user.entreprise) {
                    throw new Error("Aucune entreprise associée à cet utilisateur");
                }

                if (!user.entreprise.abonnementActif) {
                    throw new Error("Abonnement expiré");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Mot de passe incorrect");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    entrepriseId: user.entrepriseId,
                    onboardingComplete: user.onboardingComplete,
                    plan: user.entreprise.plan,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 jours - durée totale de la session
        updateAge: 0, // Revalider à chaque requête pour avoir les données fraîches
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account }) {
            // Handle OAuth sign in (Google)
            if (account?.provider === "google") {
                try {
                    // Check if user already exists in database
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                        include: { entreprise: true },
                    });

                    if (!existingUser) {
                        // Create entreprise + user automatically for OAuth
                        const result = await prisma.$transaction(async (tx) => {
                            // Check if entreprise with this email already exists
                            let entreprise = await tx.entreprise.findUnique({
                                where: { email: user.email! },
                            });

                            // If no entreprise exists, create one
                            if (!entreprise) {
                                entreprise = await tx.entreprise.create({
                                    data: {
                                        nom: user.name || "Mon Entreprise",
                                        email: user.email!,
                                        plan: "FREE",
                                        abonnementActif: true,
                                    },
                                });
                            }

                            // Create user (OWNER role for first user via OAuth)
                            const newUser = await tx.user.create({
                                data: {
                                    email: user.email!,
                                    name: user.name || "",
                                    password: "", // Empty for OAuth users
                                    role: "OWNER",
                                    status: "ACTIVE",
                                    entrepriseId: entreprise.id,
                                    onboardingComplete: false,
                                },
                            });

                            // Create or update default settings
                            const existingParams = await tx.parametresEntreprise.findUnique({
                                where: { entrepriseId: entreprise.id },
                            });

                            if (!existingParams) {
                                await tx.parametresEntreprise.create({
                                    data: {
                                        entrepriseId: entreprise.id,
                                        nom_entreprise: user.name || "Mon Entreprise",
                                    },
                                });
                            }

                            return newUser;
                        });

                        return true;
                    }

                    // Check if entreprise exists and is active
                    if (!existingUser.entreprise) {
                        console.error("User has no associated entreprise");
                        return false;
                    }

                    if (!existingUser.entreprise.abonnementActif) {
                        console.error("Subscription expired for entreprise:", existingUser.entreprise.nom);
                        return false;
                    }
                } catch (error) {
                    console.error("Error validating OAuth user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
                token.entrepriseId = (user as unknown).entrepriseId;
                token.onboardingComplete = (user as unknown).onboardingComplete;
                token.plan = user.plan || "FREE";
            }

            // For OAuth users, fetch from database on first sign in
            if (account?.provider === "google" && user.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    include: { entreprise: true },
                });

                if (dbUser && dbUser.entreprise) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.entrepriseId = dbUser.entrepriseId;
                    token.onboardingComplete = dbUser.onboardingComplete;
                    token.plan = dbUser.entreprise.plan;
                }
            }

            // Refetch onboarding status and plan from DB when session is updated
            if (trigger === "update" && token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: {
                        onboardingComplete: true,
                        entreprise: {
                            select: { plan: true }
                        }
                    },
                });

                if (dbUser) {
                    token.onboardingComplete = dbUser.onboardingComplete;
                    if (dbUser.entreprise) {
                        token.plan = dbUser.entreprise.plan;
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.plan = token.plan as string;
                (session.user as unknown).entrepriseId = token.entrepriseId as string;
                (session.user as unknown).onboardingComplete = token.onboardingComplete as boolean;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
