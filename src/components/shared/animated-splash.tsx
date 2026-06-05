"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@capacitor/splash-screen";

export function AnimatedSplash() {
  const [stage, setStage] = useState<"loading" | "zooming" | "splitting" | "done">("loading");

  useEffect(() => {
    // Only play once per session
    if (sessionStorage.getItem("splash_played") === "true") {
      setTimeout(() => setStage("done"), 0);
      return;
    }
    sessionStorage.setItem("splash_played", "true");

    // Hide the native OS splash screen instantly once React is ready!
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch {
        // Ignore if running in web browser
      }
    };
    hideNativeSplash();

    // 1. Show logo for 1.8 seconds
    const t1 = setTimeout(() => {
      setStage("zooming");
    }, 1800);

    // 2. Zoom out for 0.6s, then split
    const t2 = setTimeout(() => {
      setStage("splitting");
    }, 2400);

    // 3. Remove from DOM after split finishes (1.2s)
    const t3 = setTimeout(() => {
      setStage("done");
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Top Left Triangle */}
      <div
        className={`absolute inset-0 bg-background transition-transform duration-[1200ms] ease-in-out z-10
          ${stage === "splitting" ? "-translate-x-full -translate-y-full" : "translate-x-0 translate-y-0"}
        `}
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      
      {/* Bottom Right Triangle */}
      <div
        className={`absolute inset-0 bg-background transition-transform duration-[1200ms] ease-in-out z-10
          ${stage === "splitting" ? "translate-x-full translate-y-full" : "translate-x-0 translate-y-0"}
        `}
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />

      {/* Center Logo container (Sits above the doors during loading, fades/zooms during split) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-700
          ${stage === "loading" ? "scale-100 opacity-100" : ""}
          ${stage === "zooming" ? "scale-50 opacity-100" : ""}
          ${stage === "splitting" ? "scale-[5] opacity-0" : ""}
        `}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
          <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
            <path d="M64 176L112 112L144 144L192 80" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="192" cy="80" r="16" fill="currentColor"/>
            <circle cx="64" cy="176" r="16" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
