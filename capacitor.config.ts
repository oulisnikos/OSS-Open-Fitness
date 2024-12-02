import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'gr.oss.open.fitness',
  appName: 'Open Fitness',
  webDir: 'www',
  // bundledWebRuntime: false,
  // cordova: {
  //   preferences: {
  //     ScrollEnabled: 'false',
  //     BackupWebStorage: 'none',
  //     SplashMaintainAspectRatio: 'true',
  //     FadeSplashScreenDuration: '300',
  //     SplashShowOnlyFirstTime: 'false',
  //     SplashScreen: 'screen',
  //     SplashScreenDelay: '3000'
  //   }
  // },
  android: {
    allowMixedContent: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    SplashScreen : {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
      androidSplashResourceName: "splash",
    }
  }
};

export default config;
