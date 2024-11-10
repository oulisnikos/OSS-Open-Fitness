import { Component, OnInit } from "@angular/core";
// import { AppVersion } from "@ionic-native/app-version/ngx";
// TODO: Replace @ionic-native/email-composer
// import { EmailComposer } from "@ionic-native/email-composer/ngx";
// TODO: Replace @ionic-native/device/
// import { Device } from "@ionic-native/device/ngx";
import { AlertController, IonRouterOutlet, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
// FIXME: When copy Settings component from original project
// import { SettingsPage } from "../../settings/settings.page";
import { AuthService } from "ionic-appauth";
import { App } from "@capacitor/app";
import { Device } from "@capacitor/device";
import { AppStateProvider } from "src/app/service/app-state";
import { GymProgramsProvider } from "src/app/service/gym-programs.provider";
import { WebViewCache } from "capacitor-plugin-webview-cache";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  versionCode!: string | number;
  versionNumber!: string;
  userData: any = {};
  constructor(
    private authService: AuthService,
    public appState: AppStateProvider,
    private alertCtrl: AlertController,
    private gymPrograms: GymProgramsProvider,
    // TODO: Replace emailComposer and here
    // private emailComposer: EmailComposer,
    // private device: Device,
    // private appVersion: AppVersion,
    private router: Router,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    //private notification: PushNotificationsService
  ) {

      App.getInfo().then((info) => {
        this.versionCode =  info.build;
        this.versionNumber = info.version;
      })
  }

  ngOnInit() {
    this.authService.user$.subscribe((result) => {
      this.userData = result;
    });
  }

  ionViewDidEnter() {
    this.authService.loadUserInfo();

    // (window as any).CacheClear(
    //   () => {
    //     console.log("clear cache success");
    //   },
    //   () => {
    //     console.log("clear cache error");
    //   }
    // );
    WebViewCache.clearCache().then(
      () => {
        console.log("clear cache success");
      }
    ).catch((error) => {
      console.log("clear cache error");
    }) ;
  }

  async logout() {
    const confirm = await this.alertCtrl.create({
      header: "Logout!",
      message: "Would you like to log out of the Open Fitness App?",
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Log Out",
          handler: async () => {
            this.appState.initState();
            //this.notification.unregisterPushNotifications(true);
            await this.authService.signOut();
            //this.notification.unregisterPushNotifications();
            this.router.navigateByUrl("/landing");
          },
        },
      ],
    });
    confirm.present();
  }

  async onContactUs() {
    const confirm = await this.alertCtrl.create({
      header: "Hello!",
      message:
        "We'd love to hear from you!. The Open Fitness team is happy to field all of your questions and comments",
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Open Email",
          handler: () => {
            this.openEmail();
          },
        },
      ],
    });
    confirm.present();
  }

  async openEmail() {
    let vmailEpik = "";
    if (this.appState && this.appState.explorePlanaDay && this.appState.explorePlanaDay.stoixeiaEtaireias) {
      vmailEpik = this.appState.explorePlanaDay.stoixeiaEtaireias.mailEpikoinonias1;
    }
    const deviceInfo = await Device.getInfo();
    //    this.emailComposer.isAvailable().then(() => {
    let email = {
      to: vmailEpik,
      // cc: "erika@mustermann.de",
      // bcc: ["john@doe.com", "jane@doe.com"],
      // attachments: [
      //   "file://img/logo.png",
      //   "res://icon.png",
      //   "base64:icon.png//iVBORw0KGgoAAAANSUhEUg...",
      //   "file://README.pdf"
      // ],
      subject: "Here's my feedback about Open Fitness app",
      body: `<br><br><br>For the Open Fitness Team:<br>
        Device:${deviceInfo.model}<br>
        Platform: ${deviceInfo.platform}<br>
        Platform Version: ${deviceInfo.osVersion}<br>
        Application Version: ${this.versionCode} (${this.versionNumber})`,
      isHtml: true,
    };

    // TODO: Fix this method that call emailComposer
    // Send a text message using default options
    // this.emailComposer.open(email);
    //  });
  }

  onWebSiteOpen() {
    const gymCode = this.userData.mobile_api_routing;
    this.gymPrograms.getGymsWebSites().subscribe((sites) => {
      const searched = sites.gyms.find(x => x.code = gymCode)
      if (searched) {
        window.open(searched.site, "_system", "location=yes");
      } else {
        window.open("http://www.openfitness.gr", "_system", "location=yes");
      }
    });

    // window.open("http://www.openfitness.gr", "_system", "location=yes");
  }

  getGymImageSrc() {
    if (!this.userData) {
      return;
    }
    return `http://cdn.oss.gr:8181/gyms/${this.userData.mobile_api_routing}.png`;
  }

  async onShowSettings() {
    // FIXME: When copy Settigns Component from other project
    // const modal = await this.modalController.create({
    //   component: SettingsPage,
    //   // TODO: Check this property
    //   // swipeToClose: true,
    //   presentingElement: this.routerOutlet.nativeEl,
    // });

    // await modal.present();
  }
}
