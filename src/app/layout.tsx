import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Muo Drive",
  description: "Store all your fancy files in one place",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getSession();

  // if (session) {
  //   await authorizeRootFolder(session?.user?.sub);
  // }

  return (
    <html lang="en" className="min-h-screen">
      <body className="min-h-screen">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
