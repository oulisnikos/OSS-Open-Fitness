import { Injectable } from "@angular/core";
import { filter, switchMap, tap } from "rxjs/operators";
import { AuthService } from "ionic-appauth";
// TODO: Replace @ionic-native/firebase-x
// import { FirebaseUser, FirebaseX } from "@ionic-native/firebase-x/ngx";
import { AlertController, Platform } from "@ionic/angular";
import { OssAuthServiceExtension } from "./auth/extension/oss-auth-service-extension";
import { PushNotifications } from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";

@Injectable()
export class PushNotificationsService {
  // private pushOptions: PushOptions = {
  //   android: {
  //     icon: "fitness",
  //     iconColor: "#F33799",
  //     // sound: "true",
  //     forceShow: true,
  //     vibrate: true,
  //   },
  //   ios: {
  //     alert: "true",
  //     badge: "true",
  //     sound: "true",
  //   },
  //   windows: {},
  //   browser: {
  //     pushServiceURL: "http://push.api.phonegap.com/v1/push",
  //   },
  // };

  // private _notifyPto: BehaviorSubject<{
  //   userTapped: boolean;
  //   id: number;
  //   notification: EventResponse;
  // }> = new BehaviorSubject(null);

  // private _notifyTs: BehaviorSubject<{
  //   userTapped: boolean;
  //   id: number;
  //   notification: EventResponse;
  // }> = new BehaviorSubject(null);
  // private _actionButtonPressed: BehaviorSubject<EventResponse> = new BehaviorSubject(null);
  constructor(
    // private firebase: FirebaseX,
    private authService: AuthService,
    private ossAuthExtension: OssAuthServiceExtension,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {}

  // get notifyPto() {
  //   return this._notifyPto.asObservable();
  // }
  // get notifyTs() {
  //   return this._notifyTs.asObservable();
  // }
  // get actionButtonPressed() {
  //   return this._actionButtonPressed.asObservable();
  // }
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
  async registerPushNotificationForUser() {

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();

    FCM.subscribeTo({topic: this.ossAuthExtension.getOssUserName()})
      .then((r) => {console.log("subscribed to topic.")})
      .catch((err) => {console.log(err);});
    // this.firebase.hasPermission().then(async (res: any) => {
    //   if (res.isEnabled) {
    //     console.log("We have permission to send push notifications");
    //   } else {
    //     console.log("We do not have permission to send push notifications");
    //     if(this.platform.is("ios")) {
    //       await this.firebase.grantPermission();
    //     }
    //   }

    //   this.firebase.subscribe(this.ossAuthExtension.getOssUserName()).then(
    //     (value) => {
    //       console.log(`subscription to topic ${this.ossAuthExtension.getOssUserName()}`, value);
    //     }
    //   ).catch(
    //     (error) => {
    //       console.log("An error occured ", error);
    //     }
    //   );



      // this.firebase.onMessageReceived().subscribe(
      //   (value) => {
      //     console.log("On Message Received ", value);
      //   }
      // );

    // TODO: this is from old
    // });

    // // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    // this.push
    //   .createChannel({
    //     id: "testchannel1",
    //     description: "My first test channel",
    //     // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
    //     importance: 3
    //   })
    //   .then(() => console.log("Channel created"));

    // // Delete a channel (Android O and above)
    // this.push.deleteChannel("testchannel1").then(() => console.log("Channel deleted"));

    // // Return a list of currently configured channels
    // this.push.listChannels().then(channels => console.log("List of channels", channels));

    // to initialize push notifications

    // let pushObject: PushObject = this.push.init(this.pushOptions);
    // this.firebase.unregister().then((value) => {
    //   pushObject = this.push.init(this.pushOptions);

    //   pushObject
    //     .on("notification")
    //     .pipe(
    //       tap((notification) => {
    //         this.dispatchNotification(notification);
    //       })
    //     )
    //     .subscribe((notification) => {
    //       console.log("Received a notification", notification);
    //       // alert("Received a notification " + JSON.stringify(notification));
    //     });

    //   pushObject.on("registration").subscribe((registration: any) => {
    //     console.log("Device registered", registration);
    //     pushObject
    //       .subscribe(this.ossAuthExtension.getOssUserName())
    //       .then((res) => console.log(`subscription to topic ${this.ossAuthExtension.getOssUserName()}`, res));
    //   });

    //   pushObject.on("error").subscribe((error) => console.error("Error with Push plugin", error));

    //   // data contains the push payload just like a notification event
    //   pushObject
    //     .on("transition1")
    //     .pipe(tap((data) => this._actionButtonPressed.next(data)))
    //     .subscribe((data) => {
    //       console.log("transition1 pressed");
    //     });
    //   pushObject
    //     .on("transition2")
    //     .pipe(tap((data) => this._actionButtonPressed.next(data)))
    //     .subscribe((data) => {
    //       console.log("transition2 pressed");
    //     });
    //   pushObject
    //     .on("transition3")
    //     .pipe(tap((data) => this._actionButtonPressed.next(data)))
    //     .subscribe((data) => {
    //       console.log("transition3 pressed");
    //     });
    // });

  }

  unregisterPushNotifications(isAuthenticated: boolean) {
    // if(isAuthenticated) {
    //   this.firebase.unsubscribe(this.ossAuthExtension.getOssUserName()).then(
    //     (value) => {
    //       this.firebase.unregister();
    //     }
    //   );
    // } else {
    //   console.warn("push unregister");
    //   this.firebase.unregister();
    // }
    if(isAuthenticated) {
      FCM.unsubscribeFrom({topic: this.ossAuthExtension.getOssUserName()})
      .then((r) => {
        PushNotifications.unregister();
      });
    } else {
      console.warn("push unregister");
      PushNotifications.unregister();
    }
  }

  // private dispatchNotification(notification: EventResponse) {
  //   // user tapped on notification
  //   const userTapped =
  //     notification.additionalData.foreground === false &&
  //     (notification.additionalData.dismissed !== undefined || notification.additionalData.coldstart === true);

  //   if (notification.additionalData.alstomTarget === "PTO") {
  //     this._notifyPto.next({
  //       userTapped,
  //       id: notification.additionalData.alstomTargetId as number,
  //       notification,
  //     });
  //   } else if (notification.additionalData.alstomTarget === "TS") {
  //     this._notifyTs.next({
  //       userTapped,
  //       id: notification.additionalData.alstomTargetId as number,
  //       notification,
  //     });
  //   }
  // }
}
