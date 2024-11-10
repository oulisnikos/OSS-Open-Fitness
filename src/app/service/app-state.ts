import { ContractsInfo } from '../models/interfaces/gym-contract.interface';
import { Injectable } from "@angular/core";
import { GymProgram, Plano } from "../models/interfaces/gym-program.interface";
import { GymListing } from "../models/gym-listing";
import { AppPreferences } from "../models/app-preferences";
import { Storage } from "@ionic/storage-angular";
import { InfoMessages } from "../models/interfaces/info-messages.interface";
import { GymListingNew } from "../models/gym-listing.new";

@Injectable({
  providedIn: "root",
})
export class AppStateProvider {
  explorePlanaDay: GymListingNew = new GymListingNew();
  mySchedule: GymListingNew = new GymListingNew();

  exploreDay: GymListing = new GymListing();
  exploreWeek: GymListing = new GymListing();
  exploreMonth: GymListing = new GymListing();
  myScheduleDay: GymListing = new GymListing();
  myScheduleWeek: GymListing = new GymListing();
  myScheduleMonth: GymListing = new GymListing();

  infoMessages!: InfoMessages;
  constractData!: ContractsInfo;

  appPreferences: AppPreferences;

  constructor(storage: Storage) {
    this.appPreferences = new AppPreferences(storage);
  }

  initState(): void {
    this.explorePlanaDay.initialize();
    this.mySchedule.initialize();

    this.exploreDay.initialize();
    this.exploreDay.initialize();
    this.exploreWeek.initialize();
    this.exploreMonth.initialize();
    this.myScheduleDay.initialize();
    this.myScheduleWeek.initialize();
    this.myScheduleMonth.initialize();
  }

  updateGymProgramToAllLists(gymProgram: GymProgram): void {
    this.exploreDay.updateLists(gymProgram);
    this.exploreWeek.updateLists(gymProgram);
    this.exploreMonth.updateLists(gymProgram);

    this.myScheduleDay.updateLists(gymProgram);
    this.myScheduleWeek.updateLists(gymProgram);
    this.myScheduleMonth.updateLists(gymProgram);
  }

  updatePlanoToAllLists(plano: Plano): void {
    this.explorePlanaDay.updateLists(plano);
  }
}
