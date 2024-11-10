export interface Plana {
  plana: GymProgram[];
}

export interface GymProgram {
  gyplId: number;
  dateBegin: Date;
  dateEnd: Date;
  mathima: string;
  mathimaDescr: string;
  aithousa: string;
  aithousaDescr: string;
  gymnasths: number;
  gymnasthsName: string;
  gymnasthsPhotoUrl: string;
  status1descr: string;
  status2descr: string;
  status1: number;
  status2: number;
  action: number;
  callreason: string;
}

export interface GymProgramsByDay {
  day: Date;
  gymPrograms: GymProgram[];
}
export interface PlanaByDay {
  day: Date;
  plana: Plano[];
}

export interface PlanaNew {
  plana: Plano[];
}

export interface Plano {
  gyId: number;
  dtBe: Date;
  dtEn: Date;
  math: string;
  mathimaDescr: string;
  aith: string;
  aithousaDescr: string;
  gymn: number;
  gymnasthsName: string;
  gymnasthsPhotoUrl: string;
  std1: Status1;
  std2: Status2;
  acti: number;
  sta1: number;
  sta2: number;
  wlistOrder?: number;
}

export enum Status1 {
  Booked = "BOOKED",
  BookedWaitingList = "BOOKWLIST",
  Open = "OPEN",
}

export enum Status2 {
  Call = "CALL",
  Charge = "CHARGE",
  Free = "FREE",
}
