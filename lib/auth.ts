import { getServerSession } from "next-auth";
import { authOptions as options } from "@/app/api/auth/[...nextauth]/route";

export const authOptions = options;

export async function auth() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}
