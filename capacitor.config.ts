import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aifinance.app',
  appName: 'Expanda',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: "#000000",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorUpdater: {
      autoUpdate: true,
      appReadyTimeout: 10000,
    }
  }
};

export default config;
