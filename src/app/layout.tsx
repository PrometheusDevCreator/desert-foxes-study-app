import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ProgressProvider } from "@/lib/progress-context";
import AppWrapper from "@/components/AppWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desert Foxes: Kevin's Study Room - North African Campaign",
  description: "An interactive study app exploring Rommel, the North African Campaign, and the birth of the SAS through structured modules, timelines, maps, flashcards, and quizzes.",
  keywords: ["Rommel", "North Africa", "Afrika Korps", "World War II", "History", "Education", "Desert War", "SAS"],
  authors: [{ name: "Built for Kevin" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ProgressProvider>
          <AppWrapper>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AppWrapper>
        </ProgressProvider>
      </body>
    </html>
  );
}
