import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "easy to use .tech - Professional Tech Support Services",
  description: "Quick remote fixes, virus removal, on-site service, and monthly monitoring. Affordable tech support from $45. Serving Victoria area.",
  keywords: ["tech support", "remote fix", "virus removal", "onsite service", "IT support", "easy to use tech", "Victoria tech support"],
  authors: [{ name: "easy to use .tech" }],
  openGraph: {
    title: "easy to use .tech - Tech Support Made Simple",
    description: "Quick fixes, virus removal, on-site service in Victoria area",
    url: "https://easytouse.tech",
    siteName: "easy to use .tech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "easy to use .tech",
    description: "Professional tech support made simple - Remote fixes, virus removal, onsite service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
