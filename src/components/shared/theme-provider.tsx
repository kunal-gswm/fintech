"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Contrast
    const storedContrast = localStorage.getItem("expanda_contrast");
    if (storedContrast === "true") {
      setHighContrast(true);
      document.body.classList.add("high-contrast");
    }

    // Theme
    const storedTheme = localStorage.getItem("expanda_theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const handleSetHighContrast = (v: boolean) => {
    setHighContrast(v);
    localStorage.setItem("expanda_contrast", v.toString());
    if (v) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  };

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("expanda_theme", t);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProviderContext.Provider 
      value={{ 
        highContrast, 
        setHighContrast: handleSetHighContrast,
        theme,
        setTheme: handleSetTheme
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
