import { Component, OnDestroy, OnInit } from "@angular/core";
// import { AppVersion } from "@ionic-native/app-version/ngx";
import { AlertController, IonRouterOutlet, ModalController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
// FIXME: When copy Settings component from original project
// import { SettingsPage } from "../../settings/settings.page";
// import { AuthService } from "ionic-appauth";
import { App } from "@capacitor/app";
import { Device } from "@capacitor/device";
import { AppStateProvider } from "src/app/service/app-state";
import { GymProgramsProvider } from "src/app/service/gym-programs.provider";
import { WebViewCache } from "capacitor-plugin-webview-cache";
import { PushNotificationsService } from "src/app/service/push-notifications.service";
import { Subscription } from "rxjs";
import { OssAuthServiceExtension } from "src/app/service/extension/oss-auth-service-extension";
import { AuthActions, AuthService, IAuthAction } from "ionic-appauth";
import { Browser } from "@capacitor/browser";
import { SettingsPage } from "src/app/settings/settings.page";
import { EmailComposer } from "capacitor-email-composer";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy {
  versionCode!: string | number;
  versionNumber!: string;
  userData: any = {};
  authEventSub!: Subscription;
  constructor(
    private authService: AuthService,
    private ossextension: OssAuthServiceExtension,
    public appState: AppStateProvider,
    private alertCtrl: AlertController,
    private gymPrograms: GymProgramsProvider,
    // private appVersion: AppVersion,
    //private router: Router,
    private navCtr: NavController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private notification: PushNotificationsService
  ) {

      App.getInfo().then((info) => {
        this.versionCode =  info.build;
        this.versionNumber = info.version;
      })
  }
  ngOnDestroy(): void {
    this.authEventSub.unsubscribe();
  }

  ngOnInit() {
    console.log("OnInit Profile page method running.");
    this.authEventSub = this.authService.events$.subscribe((action) => this.onSignOutSuccess(action));

    this.ossextension.getConnectedUser().then(() => {
      this.userData = this.ossextension.userInfo;
    });
  }

  private onSignOutSuccess(action: IAuthAction) {
    console.log("Auth Action ", action);
    if (action.action === AuthActions.SignOutSuccess) {
      this.navCtr.navigateRoot("landing");
    }
  }

  ionViewDidEnter() {
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
      htmlAttributes: {
        "aria-hidden": false
      },
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Log Out",
          handler: async () => {
            this.appState.initState();
            console.log("Unregister Notification.");
            this.notification.unregisterPushNotifications(true);
            console.log("This is authidication plugin configuration ", this.authService.authConfig);
            await this.authService.signOut();
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
    try {
      let vmailEpik = "";
      if (this.appState && this.appState.explorePlanaDay && this.appState.explorePlanaDay.stoixeiaEtaireias) {
        vmailEpik = this.appState.explorePlanaDay.stoixeiaEtaireias.mailEpikoinonias1;
      }
      const deviceInfo = await Device.getInfo();
      //    this.emailComposer.isAvailable().then(() => {
      const email = {
        to: [vmailEpik],
        subject: "Here's my feedback about Open Fitness app",
        body: `<br><br><br>For the Open Fitness Team:<br>
          Device:${deviceInfo.model}<br>
          Platform: ${deviceInfo.platform}<br>
          Platform Version: ${deviceInfo.osVersion}<br>
          Application Version: ${this.versionCode} (${this.versionNumber})`,
        isHtml: true,
      };

      EmailComposer.open(email);
    } catch(error) {
      throw JSON.stringify(error);
    }
  }

  onWebSiteOpen() {
    const gymCode = this.userData.mobile_api_routing;
    this.gymPrograms.getGymsWebSites().subscribe((sites) => {
      const searched = sites.gyms.find(x => x.code = gymCode)
      if (searched) {
        //window.open(searched.site, "_system", "location=yes");
        Browser.open({url: searched.site});
      } else {
        //window.open("http://www.openfitness.gr", "_system", "location=yes");
        Browser.open({url: "http://www.openfitness.gr"});
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
    const modal = await this.modalController.create({
      component: SettingsPage,
      htmlAttributes: {
        "aria-hidden": false
      },
      presentingElement: this.routerOutlet.nativeEl,
      
    });

    await modal.present();
  }
}
