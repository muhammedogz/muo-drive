import Link from "next/link";
import { getUserDTO } from "@/data/user";

export default async function HomePage() {
  const user = await getUserDTO();

  return (
    <main className="flex flex-col items-center justify-center text-center min-h-screen px-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Muo Drive</span>
          {user && <span className="text-gray-600">, {user.name}</span>}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your files are safe here. Probably. We haven&apos;t lost any this
          week.
        </p>

        <div className="flex flex-col items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <a
              href="/auth/login"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </a>
          )}
          <span className="underline cursor-not-allowed text-sm">
            Read our 92-page onboarding doc
          </span>
        </div>
      </div>

      <footer className="mt-10 text-xs text-gray-400">
        ⚡️ 0% uptime guaranteed on April Fools
      </footer>
    </main>
  );
}
