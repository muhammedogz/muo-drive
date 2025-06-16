import { auth0 } from "@/lib/auth0";

export async function getUserId(): Promise<string> {
  const session = await auth0.getSession();

  return session?.user?.sub ?? "";
}

export async function getUserDTO(): Promise<{
  sub: string;
  name: string | undefined;
  picture: string | undefined;
} | null> {
  const session = await auth0.getSession();

  if (!session) {
    return null;
  }

  return {
    sub: session?.user?.sub,
    name: session?.user?.name,
    picture: session?.user?.picture,
  };
}
