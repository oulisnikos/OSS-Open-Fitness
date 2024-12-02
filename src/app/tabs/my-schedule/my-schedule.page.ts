import { Component, ViewChild } from "@angular/core";
import { IonDatetime, IonRouterOutlet, ModalController } from "@ionic/angular";
import { fuseAnimations } from "./../../animations/animations";
import { GymListingNew } from "./../../models/gym-listing.new";
import { Plano } from "./../../models/interfaces/gym-program.interface";
import { AppStateProvider } from "./../../service//app-state";
import { GymProgramsProvider } from "./../../service/gym-programs.provider";
import { UtilsService } from "./../../service/utils/utils.service";
import { PlanoPage } from "../../plano/plano.page";
import { OpswCallNumber } from "src/app/service/call-number.service";

@Component({
  selector: "app-my-schedule",
  templateUrl: "my-schedule.page.html",
  styleUrls: ["my-schedule.page.scss"],
  animations: fuseAnimations,
})
export class MySchedulePage {
  @ViewChild("fromDateDatetimeElement", {static: false}) fromDateDt!: IonDatetime;
  listData: GymListingNew;
  isLoading: boolean = false;
  currnet_date!: string;

  constructor(
    private gymProgramProvider: GymProgramsProvider,
    public appState: AppStateProvider,
    private callNumber: OpswCallNumber,
    public utils: UtilsService,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
  ) {
    this.listData = this.appState.mySchedule;
    this.currnet_date = new Date().toISOString();
  }

  ionViewDidEnter() {
    this.smartLoadListing();
  }

  private smartLoadListing() {
    if (this.listData.plana.length !== 0) {
      return;
    }

    this.listData.plana = [];
    this.loadMySchedulePlana(null);
  }

  loadMySchedulePlana(event: any) {
    this.loadMyScheduleInternal(() => {
      if (event?.target) {
        event.target.complete();
      }
    })
  }

  private loadMyScheduleInternal(callback: Function, dateFrom?: Date) {
    this.listData.planaGroupedByDay = [];
    this.gymProgramProvider.loadMySchedule(() => {
      if (callback) {
        callback();
      }
    }, dateFrom);
  }

  async onLoadPlanoPage(plano: Plano, index: any) {
    const modal = await this.modalController.create({
      component: PlanoPage,
      componentProps: {
        plano: plano,
        index: index,
        gymLists: this.listData,
        callback: (params: any) => {
          return new Promise<void>((resolve) => {
            this.gymProgramProvider.bookOrCancelBookingNew(params.plano, params.booking, true, () => {
              this.loadMySchedulePlana(null);
            });
            resolve();
          });
        },
      },
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
  }

  gymAvatar(plano: Plano) {
    if (!plano.gymnasthsPhotoUrl || plano.gymnasthsPhotoUrl.length == 0) return "assets/imgs/gymnast-0.jpg";
    return plano.gymnasthsPhotoUrl.replace("rest.", "cdn.");
  }

  async onCall(event: MouseEvent) {
    event.stopPropagation();
    this.callNumber.call_number(this.listData.stoixeiaEtaireias.tilefonoEpikoinonias1);
  }

  onSelectFromDate(ev: any) {
    console.log("on Select Date fired....", ev);
    this.isLoading = true;
    this.loadMyScheduleInternal(() => {
      this.isLoading = false;
    }, /*new Date(ev.srcElement.value)*/ new Date(this.currnet_date));
  }

  selectDate() {
    this.fromDateDt.confirm(true);
  }

  cancel() {
    this.fromDateDt.cancel(true);
  }

  onModalDidDismiss(ev: any) {
    console.log("OnModal Did Dismiss ", ev);
  }
}
