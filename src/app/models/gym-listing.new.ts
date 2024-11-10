import { Plano, PlanaByDay } from "./interfaces/gym-program.interface";
import { Mathima } from "./interfaces/mathima.interface";
import { Aithousa } from "./interfaces/aithousa.interface";
import { Gymnastis } from "./interfaces/gymnastis.interface";
import { StoixeiaEtaireias } from "./interfaces/stoixeia-etaireias.interface";

export class GymListingNew {
  stoixeiaEtaireias!: StoixeiaEtaireias;
  plana: Plano[] = [];
  planaGroupedByDay: PlanaByDay[] = [];
  mathimata: Mathima[] = [];
  aithouses: Aithousa[] = [];
  gymnastes: Gymnastis[] = [];

  constructor() {}

  mapLists(listData: GymListingNew) {
    this.stoixeiaEtaireias = listData.stoixeiaEtaireias;
    this.mathimata = listData.mathimata;
    this.aithouses = listData.aithouses;
    this.gymnastes = listData.gymnastes;
    this.plana = listData.plana;
    this.populatePlana();
    this.planaGroupedByDay = this.getPlanaByDate(this.plana);
  }

  private populatePlana(): any {
    this.plana.forEach(plano => {
      let gymnastis = this.gymnastes.find(item => item.gymnasths == plano.gymn);
      plano.gymnasthsName = gymnastis ? gymnastis.name : "...";
      plano.gymnasthsPhotoUrl = gymnastis ? gymnastis.photoUrl : "";

      let mathima = this.mathimata.find(item => item.mathima == plano.math);
      plano.mathimaDescr = mathima ? mathima.descr : "...";

      let aithousa = this.aithouses.find(item => item.aithousa == plano.aith);
      plano.aithousaDescr = aithousa ? aithousa.descr : "...";
    });
  }

  private getPlanaByDate(plana: Plano[]): PlanaByDay[] {
    let tmp: PlanaByDay[] = [];
    let currentDate: Date = new Date(2000, 1, 1);
    plana.sort((a, b) => {
      if (a.dtBe < b.dtBe) return -1;
      if (a.dtBe > b.dtBe) return 1;
      return 0;
    });

    for (let index = 0; index < plana.length; index++) {
      const originalGymProgram = plana[index];

      if (
        this.getDateWithoutTime(currentDate).getTime() !=
        this.getDateWithoutTime(originalGymProgram.dtBe).getTime()
      ) {
        currentDate = this.getDateWithoutTime(originalGymProgram.dtBe);
        tmp.push({ day: currentDate, plana: [] });
      }
      tmp[tmp.length - 1].plana.push(Object.assign({}, originalGymProgram));
    }

    return tmp;
  }

  updateLists(plano: Plano): void {
    //update grouped by day first
    this.planaGroupedByDay.forEach(group => {
      let currentPlanoIndex = group.plana.findIndex(gymItem => gymItem.gyId == plano.gyId);
      if (currentPlanoIndex >= 0) {
        group.plana[currentPlanoIndex].sta1 = plano.sta1;
        group.plana[currentPlanoIndex].std1 = plano.std1;
        group.plana[currentPlanoIndex].sta2 = plano.sta2;
        group.plana[currentPlanoIndex].std2 = plano.std2;
        group.plana[currentPlanoIndex].acti = plano.acti;
        return;
      }
    });

    //update plana next
    let currentPlanoIndex = this.plana.findIndex(gymItem => gymItem.gyId == plano.gyId);
    if (currentPlanoIndex >= 0) {
      this.plana[currentPlanoIndex].sta1 = plano.sta1;
      this.plana[currentPlanoIndex].std1 = plano.std1;
      this.plana[currentPlanoIndex].sta2 = plano.sta2;
      this.plana[currentPlanoIndex].std2 = plano.std2;
      this.plana[currentPlanoIndex].acti = plano.acti;
    }
  }

  initialize() {
    this.stoixeiaEtaireias = { tilefonoEpikoinonias1: "2168001660", mailEpikoinonias1: "mobile@oss.gr" };
    this.plana = [];
    this.planaGroupedByDay = [];
    this.mathimata = [];
    this.aithouses = [];
    this.gymnastes = [];
  }

  private getDateWithoutTime(d: Date): Date {
    let cleanedDate!: Date;
    if (d) {
      cleanedDate = new Date(d);
      cleanedDate.setHours(0, 0, 0, 0);
    }
    return cleanedDate;
  }
}
