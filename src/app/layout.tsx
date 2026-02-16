import type { Metadata } from "next";
import Link from "next/link";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "My Investment Dashboard",
  description: "Personal investment dashboard built with Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b bg-card/70 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="text-sm font-semibold tracking-wide">
              HJ INVEST.DESK
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/news" className="text-muted-foreground hover:text-foreground">
                News
              </Link>
              <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                Portfolio
              </Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
