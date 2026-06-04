import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BusGabon — Billets de bus au Gabon",
  description: "Réservez vos billets de bus en ligne simplement et en toute sécurité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${geist.variable} antialiased font-sans bg-surface text-text`}>
        <Providers>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-semibold">
            Aller au contenu
          </a>
          <Navbar />
          <main id="main" className="min-h-[80vh]">
            <Suspense>{children}</Suspense>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
