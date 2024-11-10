import { GymProgram, GymProgramsByDay } from "./interfaces/gym-program.interface";
import { Mathima } from "./interfaces/mathima.interface";
import { Aithousa } from "./interfaces/aithousa.interface";
import { Gymnastis } from "./interfaces/gymnastis.interface";
import { StoixeiaEtaireias } from "./interfaces/stoixeia-etaireias.interface";

export class GymListing {
  stoixeiaEtaireias!: StoixeiaEtaireias;
  plana: GymProgram[] = [];
  planaGroupedByDay: GymProgramsByDay[] = [];
  mathimata: Mathima[] = [];
  aithouses: Aithousa[] = [];
  gymnastes: Gymnastis[] = [];

  constructor() {}

  mapLists(listData: GymListing) {
    this.stoixeiaEtaireias = listData.stoixeiaEtaireias;
    this.mathimata = listData.mathimata;
    this.aithouses = listData.aithouses;
    this.gymnastes = listData.gymnastes;
    this.plana = listData.plana;
    this.populatePlana();
    this.planaGroupedByDay = this.getGymProgramsGroupedByDate(this.plana);
  }

  private populatePlana(): any {
    this.plana.forEach(plano => {
      let gymnastis = this.gymnastes.find(item => item.gymnasths == plano.gymnasths);
      plano.gymnasthsName = gymnastis ? gymnastis.name : "...";
      plano.gymnasthsPhotoUrl = gymnastis ? gymnastis.photoUrl : "";

      let mathima = this.mathimata.find(item => item.mathima == plano.mathima);
      plano.mathimaDescr = mathima ? mathima.descr : "...";

      let aithousa = this.aithouses.find(item => item.aithousa == plano.aithousa);
      plano.aithousaDescr = aithousa ? aithousa.descr : "...";
    });
  }

  private getGymProgramsGroupedByDate(gymPrograms: GymProgram[]): GymProgramsByDay[] {
    let tmp: GymProgramsByDay[] = [];
    let currentDate: Date = new Date(2000, 1, 1);
    gymPrograms.sort((a, b) => {
      if (a.dateBegin < b.dateBegin) return -1;
      if (a.dateBegin > b.dateBegin) return 1;
      return 0;
    });

    for (let index = 0; index < gymPrograms.length; index++) {
      const originalGymProgram = gymPrograms[index];

      if (
        this.getDateWithoutTime(currentDate).getTime() !=
        this.getDateWithoutTime(originalGymProgram.dateBegin).getTime()
      ) {
        currentDate = this.getDateWithoutTime(originalGymProgram.dateBegin);
        tmp.push({ day: currentDate, gymPrograms: [] });
      }
      tmp[tmp.length - 1].gymPrograms.push(Object.assign({}, originalGymProgram));
    }

    return tmp;
  }

  updateLists(gymProgram: GymProgram): void {
    this.planaGroupedByDay.forEach(group => {
      let currentGymProgramIndex = group.gymPrograms.findIndex(
        gymItem => gymItem.gyplId == gymProgram.gyplId
      );
      if (currentGymProgramIndex >= 0) {
        group.gymPrograms[currentGymProgramIndex].status1 = gymProgram.status1;
        group.gymPrograms[currentGymProgramIndex].status1descr = gymProgram.status1descr;
        group.gymPrograms[currentGymProgramIndex].status2 = gymProgram.status2;
        group.gymPrograms[currentGymProgramIndex].status2descr = gymProgram.status2descr;
        group.gymPrograms[currentGymProgramIndex].action = gymProgram.action;
        return;
      }
    });
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
  }}
