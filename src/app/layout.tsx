import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Expanda",
  description: "Your intelligent financial companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Expanda",
  },
  keywords: [
    "personal finance",
    "expense tracker",
    "budgeting",
    "investments",
    "AI advisor",
    "financial planning",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
};

import { AnimatedSplash } from "@/components/shared/animated-splash";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { FAB } from "@/components/shared/fab";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans hide-scrollbar">
        <ThemeProvider>
          <AnimatedSplash />
          {children}
          <FAB />
        </ThemeProvider>
      </body>
    </html>
  );
}
