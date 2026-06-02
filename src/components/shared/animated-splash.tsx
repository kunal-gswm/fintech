"use client";

import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { SplashScreen } from "@capacitor/splash-screen";

export function AnimatedSplash() {
  const [stage, setStage] = useState<"loading" | "zooming" | "splitting" | "done">("loading");

  useEffect(() => {
    // Hide the native OS splash screen instantly once React is ready!
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch (e) {
        // Ignore if running in web browser
      }
    };
    hideNativeSplash();

    // 1. Show logo for 1.2 seconds
    const t1 = setTimeout(() => {
      setStage("zooming");
    }, 1200);

    // 2. Zoom out for 0.4s, then split
    const t2 = setTimeout(() => {
      setStage("splitting");
    }, 1600);

    // 3. Remove from DOM after split finishes (0.8s)
    const t3 = setTimeout(() => {
      setStage("done");
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Left Door */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-background border-r border-border transition-transform duration-700 ease-in-out z-10
          ${stage === "splitting" ? "-translate-x-full" : "translate-x-0"}
        `}
      />
      
      {/* Right Door */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-background transition-transform duration-700 ease-in-out z-10
          ${stage === "splitting" ? "translate-x-full" : "translate-x-0"}
        `}
      />

      {/* Center Logo container (Sits above the doors during loading, fades/zooms during split) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-500
          ${stage === "loading" ? "scale-100 opacity-100" : ""}
          ${stage === "zooming" ? "scale-50 opacity-100" : ""}
          ${stage === "splitting" ? "scale-[5] opacity-0" : ""}
        `}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
          <Landmark className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
