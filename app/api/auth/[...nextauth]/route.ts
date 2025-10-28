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
                });

                if (!user) {
                    throw new Error("Utilisateur non trouvé");
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
        maxAge: 7 * 24 * 60 * 60, // 7 jours
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
                    });

                    // If user doesn't exist, create them
                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email!,
                                name: user.name || "",
                                password: "", // Empty password for OAuth users
                                role: "user",
                            },
                        });
                    }
                } catch (error) {
                    console.error("Error creating OAuth user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
            }

            // For OAuth users, fetch from database on first sign in
            if (account?.provider === "google" && user.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
