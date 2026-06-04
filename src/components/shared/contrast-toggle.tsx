"use client";

import { Contrast } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ContrastToggle() {
  const { highContrast, setHighContrast } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full h-8 w-8 transition-colors"
      onClick={() => setHighContrast(!highContrast)}
      title="Toggle High Contrast"
    >
      <Contrast className="h-4 w-4" />
      <span className="sr-only">Toggle high contrast</span>
    </Button>
  );
}
