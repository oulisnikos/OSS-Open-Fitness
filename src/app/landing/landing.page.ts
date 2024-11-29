import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { AuthActions, AuthService, IAuthAction } from "ionic-appauth";
import { App } from "@capacitor/app";
import { OssAuthServiceExtension } from "../service/extension/oss-auth-service-extension";
import { Browser } from "@capacitor/browser";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.page.html",
  styleUrls: ["./landing.page.scss"],
})
export class LandingPage implements OnInit, OnDestroy {
  loginInProgress: boolean = false;
  versionCode!: string | number;
  versionNumber!: string;

  sub!: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private auth: AuthService,
    private alertController: AlertController,
    private ossExt: OssAuthServiceExtension
  ) {
    // Get Application Information
    App.getInfo().then((info) => {
      this.versionCode = info.version;
      this.versionNumber = info.build;
    })
  }

  ngOnInit() {
    this.auth.loadTokenFromStorage();
    this.sub = this.auth.events$.subscribe(
      (action) => this.onAuthEvents(action)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidEnter() {
    if(this.loginInProgress) {
      this.loginInProgress = false;
    }
    Browser.addListener('browserFinished', () => {
      this.loginInProgress = false;
    });
  }

  private async onAuthEvents(action: IAuthAction) {
    console.log("🚀 ~ file: landing.page.ts ~ line 46 ~ LandingPage ~ onAuthEvents ~ action", action);
    this.loginInProgress = true;
    if (action.action === AuthActions.SignInSuccess) {
      this.navCtrl.setDirection("root");
      this.router.navigateByUrl("/tabs");
    }
    if (action.action === AuthActions.SignInFailed) {
      this.alertController
        .create({
          header: "Signin failed",
          message: action.error,
          buttons: [{ text: "Ok" }],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    }
    this.loginInProgress = false;
  }

  public async signIn() {
    try {
      this.loginInProgress = true;
      await this.auth.signIn({});
    } catch (error) {
      console.log("an error occured on sign In ->", error);
    }
  }
}
