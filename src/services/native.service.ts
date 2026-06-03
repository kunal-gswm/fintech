import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class NativeService {
  /**
   * Checks if the app is currently running as a native mobile app (Android/iOS)
   * or running in the web browser.
   */
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Trigger light haptic feedback for UI interactions
   */
  static async hapticLight() {
    if (this.isNative()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  /**
   * Trigger heavy haptic feedback for major actions or successes
   */
  static async hapticHeavy() {
    if (this.isNative()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
  }



  /**
   * Open the native Camera to scan a receipt
   */
  static async takeReceiptPhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        width: 1200,
        allowEditing: true, // Let users crop out background noise
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
