import "server-only";
import { auth0 } from "@/lib/auth0";

export async function isAuthenticated(): Promise<boolean> {
  const session = await auth0.getSession();

  return !!session;
}
