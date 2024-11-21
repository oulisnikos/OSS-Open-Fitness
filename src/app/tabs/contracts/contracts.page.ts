import { Component, OnDestroy, OnInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { CardInfo, CardViewTypes, ContractsInfo } from "src/app/models/interfaces/gym-contract.interface";
import { GymProgramsProvider } from "src/app/service/gym-programs.provider";
import { AppStateProvider } from "src/app/service/app-state";

@Component({
    selector: "app-contracts",
    templateUrl: "./contracts.page.html",
    styleUrls: ["./contracts.page.scss"],
    animations: [
      trigger('fadein', [
        state('void', style({ opacity: 0 })),
        transition('void => *', [
          style({ opacity: 0 }),
          animate('900ms ease-out', style({ opacity: 1 }))
        ])
      ]),
      trigger('slidelefttitle', [
        transition('void => *', [
          style({ opacity: 0, transform: 'translateX(150%)' }),
          animate('900ms 300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
        ])
      ])
    ],
})
export class ContractsPage implements OnInit, OnDestroy {

  contracts: ContractsInfo | null;
  loading: boolean;
  qrViewType = CardViewTypes.VIEW_TYPE_QRCODE;
  bcViewType = CardViewTypes.VIEW_TYPE_BARCODE;
  icon!: string;

  constructor(
    private gymProgramProvider: GymProgramsProvider,
    public appState: AppStateProvider,
  ) {
    this.contracts = null;
    this.loading = false;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  ionViewDidEnter() {
    this.icon = this.appState.appPreferences.selectedViewType === CardViewTypes.VIEW_TYPE_QRCODE ? "barcode-outline" : "qr-code-outline";
    this.loadInfoInternal();
  }

  private onAfterLoadContracts(ev?: any) {
    this.contracts = {
      ...this.appState.constractData
    };

    this.loading = false;

    if (ev && ev.target) {
      ev.target.complete();
    }
  }

  hasCardNumber(icont: CardInfo): boolean {
    if (!icont) {
      return false;
    }

    return (icont.cardType === 'qr' ||
      icont.cardType === 'bc') &&
      icont.cardNumber.trim() !== '';
  }

  loadInfo(ev: any) {
    this.loadInfoInternal(ev);
  }

  private loadInfoInternal(ev?: any) {
    this.loading = true;
    this.gymProgramProvider.loadContractsInfoMessages(() => {
      this.onAfterLoadContracts(ev);
    });
  }

  changeCardView() {
    console.log(this.appState.appPreferences.selectedViewType);
    if(this.appState.appPreferences.selectedViewType === CardViewTypes.VIEW_TYPE_BARCODE) {
      this.appState.appPreferences.selectedViewType = CardViewTypes.VIEW_TYPE_QRCODE;
    } else if(this.appState.appPreferences.selectedViewType === CardViewTypes.VIEW_TYPE_QRCODE) {
      this.appState.appPreferences.selectedViewType = CardViewTypes.VIEW_TYPE_BARCODE;
    }
    this.icon = this.appState.appPreferences.selectedViewType === CardViewTypes.VIEW_TYPE_QRCODE ? "qr-code-outline" : "barcode-outline";
  }

}
