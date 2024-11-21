import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController, NavParams } from "@ionic/angular";
import { GymListingNew } from "./../models/gym-listing.new";
import { Plano } from "./../models/interfaces/gym-program.interface";
import { AppStateProvider } from "./../service/app-state";
import { GymProgramsProvider } from "./../service/gym-programs.provider";

@Component({
  selector: "app-plano",
  templateUrl: "./plano.page.html",
  styleUrls: ["./plano.page.scss"],
})
export class PlanoPage implements OnInit {
  plano: Plano;
  aithousaPhotoUrl!: string;
  callback: any;
  programDescription!: string;
  biografiko!: string;
  gymLists: GymListingNew;

  constructor(
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private appState: AppStateProvider,
    private gympProgramProvider: GymProgramsProvider,
    // private call: CallNumber,
    private modalController: ModalController
  ) {
    this.plano = navParams.get("plano");
    this.gymLists = navParams.get("gymLists");
    this.callback = this.navParams.get("callback");
  }

  ngOnInit() {
    this.gympProgramProvider.getPlanoDetails(this.plano.gyId).subscribe((planoDetails) => {
      this.programDescription = planoDetails.mathdescrmob;
      this.biografiko = planoDetails.gymnbiogr;
    });

    let aithousa = this.gymLists.aithouses.find((item) => item.aithousa == this.plano.aith);
    this.aithousaPhotoUrl = aithousa
      ? aithousa.photoUrl.replace("rest.", "cdn.")
      : "assets/imgs/program-0.jpg";
  }

  gymAvatar() {
    if (!this.plano.gymnasthsPhotoUrl || this.plano.gymnasthsPhotoUrl.length == 0)
      return "assets/imgs/gymnast-0.jpg";
    return this.plano.gymnasthsPhotoUrl.replace("rest.", "cdn.");
  }

  onBookNow(booking: boolean) {
    let title = booking
      ? this.appState.appPreferences.useLocalNotifications
        ? "Confirm Booking with Notification"
        : "Confirm Booking"
      : "Confirm Cancellation";
    let message = booking
      ? this.appState.appPreferences.useLocalNotifications
        ? "Do you want to book this program and place notification?"
        : "Do you want to book this program?"
      : "Do you want to cancel this booking?";
    this.presentConfirm(title, message, () =>
      //first call the callback from the parent page
      this.callback({
        plano: this.plano,
        booking: booking,
      }).then(() => {
        this.modalController.dismiss();
      })
    );
  }

  async presentConfirm(title: string, message: string, yesCallback: any) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: yesCallback,
        },
      ],
    });
    alert.present();
  }

  // TODO: Crea method that can call from application
  async onCall() {
    // try {
    //   await this.call.callNumber(this.gymLists.stoixeiaEtaireias.tilefonoEpikoinonias1, true);
    // } catch (error) {
    //   console.log(error);
    // }
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
