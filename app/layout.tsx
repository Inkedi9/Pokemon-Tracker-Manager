import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { CollectionProvider } from "@/components/collection/collection-provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Tracker Manager",
  description: "Personal Pokémon card collection manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${jetbrainsMono.variable} min-h-screen antialiased font-mono`}>
        <CollectionProvider>
          <Navbar />
          <Sidebar />

          <main className="min-h-screen pt-16 pl-60">
            {children}
          </main>
          <Footer />
          <Toaster />
        </CollectionProvider>
      </body>
    </html>
  );
}