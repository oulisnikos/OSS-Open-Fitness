import { Component } from "@angular/core";
import { AppStateProvider } from "./../../service/app-state";
import { GymProgramsProvider } from "./../../service/gym-programs.provider";

@Component({
  selector: "app-messages",
  templateUrl: "messages.page.html",
  styleUrls: ["messages.page.scss"],
})
export class MessagesPage {
  loading: boolean = true;
  constructor(private gymProgramProvider: GymProgramsProvider, public appState: AppStateProvider) {}

  ionViewDidEnter() {
    this.loading = true;
    this.gymProgramProvider.loadInfoMessages(() => {
      this.loading = false;
    });
  }
}
