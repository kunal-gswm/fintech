import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';

export class NativeService {
  /**
   * Checks if the app is currently running as a native mobile app (Android/iOS)
   * or running in the web browser.
   */
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Request Biometric Authentication (FaceID / Fingerprint)
   */
  static async requestBiometrics(): Promise<boolean> {
    if (!this.isNative()) {
      // In a browser, we mock the biometrics success after a short delay
      console.log('Mocking Biometric Authentication for Web...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true; 
    }

    try {
      // Since we don't have the biometric plugin installed yet (due to native dependencies),
      // we can return a mock success for now, or you can implement the plugin call here:
      // const result = await NativeBiometric.verifyIdentity({ ... });
      
      // For now, simulating native success:
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Biometric auth failed', error);
      return false;
    }
  }

  /**
   * Open the native Camera to scan a receipt
   */
  static async takeReceiptPhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      return image.dataUrl || null;
    } catch (error) {
      console.error('Failed to take photo', error);
      return null;
    }
  }

  /**
   * Schedule a native local notification reminder
   */
  static async scheduleDailyReminder() {
    if (!this.isNative()) {
      console.log('Local Notifications are not supported in the browser.');
      return;
    }

    try {
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Log Your Expenses!",
              body: "Don't forget to track your spending today to stay on budget.",
              id: 1,
              schedule: {
                on: { hour: 20, minute: 0 } // 8 PM daily
              }
            }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to schedule notification', error);
    }
  }
}
