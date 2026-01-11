import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Armadillos Company Limited | Mining, Real Estate, Agrobusiness",
  description: "Trusted gold mining investment, premium real estate, and modern agrobusiness in Tanzania.",
};

import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/theme-provider";
import { InitialLoadProvider } from "@/components/providers/InitialLoadProvider";
import { ThemeShortcuts } from "@/components/layout/ThemeShortcuts";
import { Toaster } from "sonner"; // Import Sonner Toaster
import { NewsFloatingIcon } from "@/components/layout/NewsFloatingIcon";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeShortcuts />
          <InitialLoadProvider>
            <SmoothScroll>{children}</SmoothScroll>
            <NewsFloatingIcon />
            <Toaster richColors position="top-center" closeButton />
          </InitialLoadProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
