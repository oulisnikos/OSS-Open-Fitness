import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { AuthService } from 'ionic-appauth';
import { Storage} from '@ionic/storage-angular';
import { PushNotificationsService } from './service/push-notifications.service';

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
    private pushNotificationsService: PushNotificationsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async() => {
      try {
        const applicationInfo = await App.getInfo();
        console.log("Application Information ", applicationInfo);
        // Initialize Storage
        await this.storage.create();
        console.log("Storage initialized successfully!");

        // Initialize AuthService
        await this.authService.init();
        console.log("Authorization Service initialize successfully!");

        this.pushNotificationsService.bootstrapPushNotifications();

        StatusBar.setBackgroundColor({color: "#b42770"});
        StatusBar.show();
      } catch(error) {
        console.log("An error occured on Application initialization ->", error);
      }
    });
  }
}
