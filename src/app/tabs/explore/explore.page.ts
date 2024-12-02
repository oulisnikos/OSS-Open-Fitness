import { PlanoFilter } from 'src/app/models/plano-filter';
import { GenFilter } from './../../models/interfaces/filter.interface';
import { PlanoFilterComponent } from './../../components/plano-filter/plano-filter.component';
import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonContent,
  IonRouterOutlet,
  ModalController,
} from "@ionic/angular";
import { isAfter, isBefore } from "date-fns";
import { fuseAnimations } from "./../../animations/animations";
import { GymListingNew } from "./../../models/gym-listing.new";
import { Plano } from "./../../models/interfaces/gym-program.interface";
import { AppStateProvider } from "./../../service/app-state";
import { GymProgramsProvider } from "./../../service/gym-programs.provider";
import { UtilsService } from "./../../service/utils/utils.service";
import { PlanoPage } from "../../plano/plano.page";
import { OpswCallNumber } from 'src/app/service/call-number.service';
import { OssAuthServiceExtension } from 'src/app/service/extension/oss-auth-service-extension';
import { Network } from '@capacitor/network';

@Component({
  selector: "app-explore",
  templateUrl: "explore.page.html",
  styleUrls: ["explore.page.scss"],
  animations: fuseAnimations,
})
export class ExplorePage {
  listData: GymListingNew;
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  filteredPlana: Plano[] = [];
  private genFilter: GenFilter = {filters: []};
  @ViewChild("content") content!: IonContent;
  isConnected: boolean = true;

  constructor(
    private router: Router,
    private gymProgramProvider: GymProgramsProvider,
    public appState: AppStateProvider,
    public utils: UtilsService,
    private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
    private opswCallNum: OpswCallNumber,
    private ossAuthExt: OssAuthServiceExtension
  ) {
    this.listData = this.appState.explorePlanaDay;
  }

  async ionViewDidEnter() {
    setInterval(() => {
      Network.getStatus().then((valStat) => {
        this.isConnected = valStat.connected;
      });
    }, 5000);
    console.log("Ion view did enter and after load plana if empty.");
    await this.ossAuthExt.getConnectedUser();
    this.loadListIfEmpty();
  }

  private loadListIfEmpty() {
    console.log("Data ", this.listData.plana);
    if (this.listData.plana.length > 0) {
      return;
    }
    this.simulateRefresher();
  }

  private simulateRefresher() {
    this.filteredPlana = []; //clear the existing list
    this.loadPlana(null);
  }

  onDateRangeChanged(dateRange: { dateFrom: Date; dateTo: Date }) {
    if (!this.utils.isEqualDatePart(dateRange.dateFrom, this.dateFrom)) {
      this.dateFrom = dateRange.dateFrom;
      this.dateTo = dateRange.dateTo;
      this.simulateRefresher();
    } else {
      this.dateFrom = dateRange.dateFrom;
      this.dateTo = dateRange.dateTo;
      this.loadCompletedApplyFilters();
    }
  }

  loadPlana(event: any) {
    this.filteredPlana = [];
    this.gymProgramProvider.loadExplorePlanaDay(this.dateFrom, () => {
      this.loadCompletedApplyFilters();
      if (event?.target) {
        event.target.complete();
      }
    });
  }

  private loadCompletedApplyFilters() {
    const vplana: Plano[] = this.getFilteredPlana(); //apply Time range filter
    const genFilterComp: PlanoFilter = new PlanoFilter();
    genFilterComp.Filters = this.genFilter;
    genFilterComp.Plana = vplana;

    this.filteredPlana = genFilterComp.loadPlanaGenFiltered(vplana);
  }

  getFilteredPlana(): Plano[] {
    return this.listData.plana.filter((plano) => {
      return !isBefore(plano.dtBe, this.dateFrom) && !isAfter(plano.dtEn, this.dateTo);
    });
  }

  async onLoadPlanoPage(plano: Plano, index:number) {
    const modal = await this.modalCtrl.create({
      component: PlanoPage,
      componentProps: {
        plano: plano,
        index: index,
        gymLists: this.listData,
        callback: (params: any) => {
          return new Promise<void>((resolve) => {
            this.gymProgramProvider.bookOrCancelBookingNew(params.plano, params.booking, true, () => {
              this.loadPlana(null);
            });
            resolve();
          });
        },
      },
      //
      //swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
  }
  gymAvatar(plano: Plano) {
    if (!plano.gymnasthsPhotoUrl || plano.gymnasthsPhotoUrl.length == 0) return "assets/imgs/gymnast-0.jpg";
    return plano.gymnasthsPhotoUrl.replace("rest.", "cdn.");
  }

  // COMPLETE 
  // TODO: Fix this Method Because use CallNumber
  async onCall(event: MouseEvent) {
    await this.opswCallNum.call_number(this.listData.stoixeiaEtaireias.tilefonoEpikoinonias1);
  }

  resizeContent(expanded: any) {
    // this.content.resize();
  }

  async showFilters(ev: any) {
    const modal = await this.modalCtrl.create({
      component: PlanoFilterComponent,
      componentProps: {
        OnDoFilter: (plana: any, filters: any) => this.onDoFilter(plana, filters),//Event on filter.
        plana: this.getFilteredPlana(),
        filters: this.genFilter,
      },
      backdropDismiss: true,
      keyboardClose: true,
      showBackdrop: false,
      htmlAttributes: {
        "aria-hidden": false
      }
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    if (data && data.role === "backdrop") {
      this.loadCompletedApplyFilters();
    }
  }

  private onDoFilter(plana: Plano[], filters: GenFilter) {
    this.filteredPlana = plana;
    this.genFilter = filters;
  }

  get selectedFiltered(): number {
    let result = 0;

    if (this.genFilter && this.genFilter.filters) {
      this.genFilter.filters.forEach((value) => {
        if (value.filters) {
          value.filters.forEach((value1) => {
            if (value1.checked) {
              result ++;
            }
          });
        }
      });
    }

    return result;
  }
}
