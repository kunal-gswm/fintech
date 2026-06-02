"use client";

import { useState, useEffect } from "react";
import { Download, Rocket, X } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

export function UpdateNotifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState<GitHubRelease | null>(null);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const response = await fetch(`https://api.github.com/repos/${APP_CONFIG.GITHUB_REPO}/releases/latest`);
        if (!response.ok) return;

        const data: GitHubRelease = await response.json();
        
        // If the latest tag is different from our current version, an update is available!
        if (data.tag_name && data.tag_name !== APP_CONFIG.APP_VERSION) {
          setReleaseInfo(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to check for updates", error);
      }
    }

    // Only check once on mount
    checkForUpdates();
  }, []);

  if (!releaseInfo) return null;

  // Find the APK file from the release assets
  const apkAsset = releaseInfo.assets.find(a => a.name.endsWith('.apk'));

  const handleUpdate = () => {
    if (apkAsset) {
      window.open(apkAsset.browser_download_url, '_blank');
      setIsOpen(false);
    } else {
      // Fallback to github release page if APK asset is missing
      window.open(`https://github.com/${APP_CONFIG.GITHUB_REPO}/releases/latest`, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Rocket className="w-5 h-5 text-primary" />
            Update Available!
          </DialogTitle>
          <DialogDescription>
            A new version of AI Finance ({releaseInfo.tag_name}) is ready to download.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-md p-4 max-h-40 overflow-y-auto text-sm my-2 border">
          <p className="font-semibold mb-2">What's New in {releaseInfo.name}:</p>
          <div className="whitespace-pre-wrap text-muted-foreground">
            {releaseInfo.body || "Various improvements and bug fixes."}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Remind Me Later
          </Button>
          <Button onClick={handleUpdate} className="w-full sm:w-auto gap-2">
            <Download className="w-4 h-4" />
            Download Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
