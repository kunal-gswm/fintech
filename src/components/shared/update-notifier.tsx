"use client";

import { useState, useEffect } from "react";
import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function UpdateNotifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);

  useEffect(() => {
    let listener: { remove: () => void } | null = null;
    
    async function setupUpdater() {
      try {
        const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
        
        // Listen for successful background update downloads
        listener = await CapacitorUpdater.addListener('download', (info: { version: string }) => {
          setUpdateVersion(info.version);
          setIsOpen(true);
        });
      } catch (error) {
        console.error("Capgo Updater not available", error);
      }
    }

    setupUpdater();
    return () => {
      if (listener) listener.remove();
    };
  }, []);

  const handleApplyUpdate = async () => {
    try {
      const { CapacitorUpdater } = await import('@capgo/capacitor-updater');
      if (updateVersion) {
        // This will immediately restart the app with the new version
        await CapacitorUpdater.set({ id: updateVersion }); 
      }
    } catch (error) {
      console.error("Failed to apply update", error);
    }
  };

  if (!updateVersion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Rocket className="w-5 h-5 text-primary" />
            Update Ready!
          </DialogTitle>
          <DialogDescription>
            A new version of AI Finance has been downloaded in the background.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Apply on Next Restart
          </Button>
          <Button onClick={handleApplyUpdate} className="w-full sm:w-auto gap-2">
            <Download className="w-4 h-4" />
            Restart & Update Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
