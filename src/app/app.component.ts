import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
// import { AuthService } from 'ionic-appauth';
import { Storage} from '@ionic/storage-angular';
import { PushNotificationsService } from './service/push-notifications.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from 'ionic-appauth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private storage: Storage,
    private pushNotification: PushNotificationsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async() => {
      try {
        
        if(this.platform.is('android') || this.platform.is('ios')) {
          const applicationInfo = await App.getInfo();
          console.log("Get Application Information ", applicationInfo);
        }
        
        // Initialize Storage
        await this.storage.create();
        console.log("Storage initialized successfully!");

        // Initialize AuthService
        await this.authService.init();
        console.log("Authorization Service initialize successfully!");
        
        // Notification Initialization
        this.pushNotification.bootstrapPushNotifications();
        console.log("Boostrap Push Notification Success!");
        
        // This future is supported only in Android.
        if (!this.platform.is("ios")) {
          StatusBar.setBackgroundColor({color: "#b42770"});
        }
        StatusBar.show();
        SplashScreen.hide();

      } catch(error) {
        console.log("[ERROR] on App Initialization ", error);
      }
    });
  }
}
