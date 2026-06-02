"use client";

import { useState } from "react";
import { Camera as CameraIcon, ScanLine, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeService } from "@/services/native.service";
import Tesseract from "tesseract.js";

interface ReceiptScannerProps {
  onScanComplete: (data: { amount: string; merchant: string; date: string }) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const handleScan = async () => {
    try {
      const photoDataUrl = await NativeService.takeReceiptPhoto();
      if (!photoDataUrl) return; // User cancelled or failed

      setIsScanning(true);
      setStatusText("Initializing AI Scanner...");
      setProgress(10);

      // Analyze image using local OCR
      const result = await Tesseract.recognize(
        photoDataUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setStatusText("Reading Receipt Text...");
              setProgress(10 + Math.floor(m.progress * 80));
            }
          }
        }
      );

      setStatusText("Extracting Data...");
      setProgress(95);

      const text = result.data.text.toLowerCase();
      
      // Basic heuristic extraction
      let amount = "";
      let merchant = "Unknown Merchant";
      
      // Try to find amounts (e.g. $15.99, Total: 15.99)
      const amountMatch = text.match(/\$?\s*(\d+\.\d{2})/g);
      if (amountMatch && amountMatch.length > 0) {
        // Assume the largest number is the total, or the last one
        const numbers = amountMatch.map(s => parseFloat(s.replace(/[^0-9.]/g, '')));
        amount = Math.max(...numbers).toString();
      }

      // Try to get merchant from the first line
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      if (lines.length > 0) {
        // Just title case the first line
        merchant = lines[0].replace(/\b\w/g, c => c.toUpperCase());
      }

      setProgress(100);
      setStatusText("Complete!");
      
      setTimeout(() => {
        setIsScanning(false);
        setProgress(0);
        onScanComplete({
          amount: amount || "0.00",
          merchant: merchant,
          date: new Date().toISOString().split('T')[0]
        });
      }, 1000);

    } catch (error) {
      console.error("Scan failed", error);
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full">
      {!isScanning ? (
        <Button onClick={handleScan} variant="outline" className="w-full border-dashed gap-2">
          <CameraIcon className="w-4 h-4" />
          Scan Receipt
        </Button>
      ) : (
        <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/30 space-y-3">
          <div className="relative w-12 h-12 flex items-center justify-center text-primary">
            {progress === 100 ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            ) : (
              <ScanLine className="w-8 h-8 animate-pulse" />
            )}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" 
                      strokeDasharray={2 * Math.PI * 22} 
                      strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)} 
                      className="transition-all duration-300" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{statusText}</p>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
