"use client";

import { useState, useEffect } from "react";
import { Lock, Fingerprint, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeService } from "@/services/native.service";
import { PageTransition } from "./page-transition";

export function BiometricLockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // We need to check if biometrics are enabled in settings
  // For now, we assume it's enabled for the sake of the feature showcase
  const biometricsEnabled = typeof window !== 'undefined' ? localStorage.getItem('biometrics_enabled') === 'true' : false;

  const authenticate = async () => {
    setIsChecking(true);
    const success = await NativeService.requestBiometrics();
    if (success) {
      setIsLocked(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    if (!biometricsEnabled) {
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => {
        setIsLocked(false);
        setIsChecking(false);
      }, 0);
      return;
    }

    // Try to auto-authenticate on mount
    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricsEnabled]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
           <Lock className="w-12 h-12 text-primary/50 mb-4" />
           <p className="text-muted-foreground">Securing App...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Fingerprint className="w-12 h-12 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">App Locked</h1>
              <p className="text-muted-foreground">Please authenticate to access your financial data.</p>
            </div>

            <Button onClick={authenticate} size="lg" className="w-full rounded-full h-14 text-lg shadow-lg">
              <ScanFace className="w-5 h-5 mr-2" />
              Unlock App
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return <>{children}</>;
}
