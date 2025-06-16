import Navigation from "@/components/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-gray-100/40">
      <div className="flex-1 flex min-h-0">
        <Navigation  />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
