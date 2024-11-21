import { Component, ViewChild } from "@angular/core";
// TODO: Replace @ionic-native/call-number
// import { CallNumber } from "@ionic-native/call-number/ngx";
import { IonDatetime, IonRouterOutlet, ModalController } from "@ionic/angular";
import { fuseAnimations } from "./../../animations/animations";
import { GymListingNew } from "./../../models/gym-listing.new";
import { Plano } from "./../../models/interfaces/gym-program.interface";
import { AppStateProvider } from "./../../service//app-state";
import { GymProgramsProvider } from "./../../service/gym-programs.provider";
import { UtilsService } from "./../../service/utils/utils.service";
import { PlanoPage } from "../../plano/plano.page";

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

  constructor(
    private gymProgramProvider: GymProgramsProvider,
    public appState: AppStateProvider,
    // private call: CallNumber,
    public utils: UtilsService,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
  ) {
    this.listData = this.appState.mySchedule;
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
      // TODO: Check this property beacause tell that is not known
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
  }

  gymAvatar(plano: Plano) {
    if (!plano.gymnasthsPhotoUrl || plano.gymnasthsPhotoUrl.length == 0) return "assets/imgs/gymnast-0.jpg";
    return plano.gymnasthsPhotoUrl.replace("rest.", "cdn.");
  }

  // TODO: Fix this method with callNumber
  async onCall(event: MouseEvent) {
    // event.stopPropagation();
    // try {
    //   await this.call.callNumber(this.listData.stoixeiaEtaireias.tilefonoEpikoinonias1, true);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async onShowFilter(ev: any) {
    // TODO: Check methos open on IonDate
    // await this.fromDateDt.open();
  }

  onSelectFromDate(ev: any) {
    this.isLoading = true;
    this.loadMyScheduleInternal(() => {
      this.isLoading = false;
    }, new Date(ev.srcElement.value));
  }
}
