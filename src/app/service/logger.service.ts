import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  constructor(private alertCtrl: AlertController) {}

  showErrorMessage(error: any) {
    console.error(error);
    this.alertCtrl
      .create({
        header: "Error",
        message: error,
        buttons: [{ text: "Ok", role: "cancel" }]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
