import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Finance — Smart Personal Finance Platform",
  description:
    "Track expenses, learn investing, plan goals, and get AI-powered financial guidance. Make better financial decisions.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = 'light';
                let storage = localStorage.getItem('theme-storage');
                if (storage) {
                  let parsed = JSON.parse(storage);
                  theme = parsed.state.theme;
                }
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
