import { Injectable } from "@angular/core";
import { filter, switchMap, tap } from "rxjs";
import { OssAuthServiceExtension } from "./extension/oss-auth-service-extension";
import { AlertController, Platform } from "@ionic/angular";
import { AuthService } from "ionic-appauth";
import { PushNotifications } from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";

@Injectable()
export class PushNotificationsService {
  constructor(
    private authService: AuthService,
    private ossAuthExtension: OssAuthServiceExtension,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {}

  bootstrapPushNotifications() {
    this.authService.initComplete$
      .pipe(
        filter((complete) => complete),
        switchMap(() => this.authService.isAuthenticated$),
        tap((isAuthenticated) => {
            console.log(
              "🚀 ~ file: push-notifications.service.ts ~ line 64 ~ PushNotificationsService ~ tap ~ isAuthenticated",
              isAuthenticated
            );
            if (isAuthenticated) {
              this.registerPushNotificationForUser();
            } else {
              this.unregisterPushNotifications(isAuthenticated);
            }
        })
      )
      .subscribe();
  }

  // TODO: Check this method because use firebase
  // COMPLETE
  async registerPushNotificationForUser() {

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
    await this.ossAuthExtension.getConnectedUser();

    // Κάνουμε subscribe το topic το username του χειριστή.
    FCM.subscribeTo({topic: this.ossAuthExtension.getOssUserName()})
      .then((r) => {console.log("subscribed to topic.")})
      .catch((err) => {console.log(err);});
    
  }

  unregisterPushNotifications(isAuthenticated: boolean) {
    if(isAuthenticated) {
      console.log("Before unsubscribe. ", this.ossAuthExtension.getOssUserName());
      FCM.unsubscribeFrom({topic: this.ossAuthExtension.getOssUserName()})
      .then((r) => {
        PushNotifications.unregister();
      });
    } else {
      console.warn("push unregister");
      PushNotifications.unregister();
    }
  }
}
