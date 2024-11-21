import { Component, OnInit } from "@angular/core";
// import { Calendar } from "@ionic-native/calendar/ngx";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { AppStateProvider } from "../../services/app-state/app-state";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage {
  calendars: any[];

  constructor(
    public appState: AppStateProvider,
    // TODO: Replace @ionic-native/calendar
    // private calendar: Calendar,
    private plt: Platform,
    private alertCtrl: AlertController,
    private modalController: ModalController
  ) {
    this.plt.ready().then(() => {
      // TODO: Fix this method to list all availeble calendar 
      // this.calendar.listCalendars().then((cals) => {
      //   this.calendars = cals;
      // });
    });
  }

  async onSelectCalendar() {
    console.log(
      "🚀 ~ file: settings.page.ts ~ line 32 ~ SettingsPage ~ onSelectCalendar ~ this.calendars",
      this.calendars
    );
    if (!this.calendars) return;

    let alertSelectCalendar = await this.alertCtrl.create({
      header: "Select Calendar",
      inputs: Array.from(this.calendars, (cal) => {
        return {
          type: "radio",
          label: `${cal.name}`,
          value: cal.id,
          checked:
            this.appState.appPreferences.selectedCalendar &&
            this.appState.appPreferences.selectedCalendar.id == cal.id,
        };
      }),
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          handler: (data) => {
            this.calendars.forEach((cal) => {
              if (cal.id == data) {
                this.appState.appPreferences.selectedCalendar = { id: cal.id, name: cal.name };
              }
            });
          },
        },
      ],
    });
    alertSelectCalendar.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
