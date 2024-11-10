import { Storage } from "@ionic/storage-angular";
import { CardViewTypes } from "./interfaces/gym-contract.interface";
import { SelectedCalendar } from "./interfaces/selected-calendar.interface";

export class AppPreferences {
  constructor(private storage: Storage) {
    this.storage.get("use-local-notifications").then((value) => {
      this._useLocalNotifications = value;
    });
    this.storage.get("use-calendar").then((value) => {
      this._useCalendar = value;
    });
    this.storage.get("selected-calendar").then((value) => {
      this._selectedCalendar = value;
    });
    this.storage.get("selected-view-type").then((value) => {
      if(value !== undefined && value != null){
        this._selectedViewType = value;
      }
    });
  }

  //getter and setter for useLocalNotifications
  private _useLocalNotifications: boolean = true;
  get useLocalNotifications(): boolean {
    return this._useLocalNotifications;
  }
  set useLocalNotifications(value: boolean) {
    this.storage.set("use-local-notifications", value).then(() => {
      this._useLocalNotifications = value;
    });
  }

  //getter and setter for useCalendar
  private _useCalendar: boolean = true;
  get useCalendar(): boolean {
    return this._useCalendar;
  }
  set useCalendar(value: boolean) {
    this.storage.set("use-calendar", value).then(() => {
      this._useCalendar = value;
    });
  }

  //getter and setter for useCalendar
  private _selectedCalendar!: SelectedCalendar;
  get selectedCalendar() {
    return this._selectedCalendar;
  }
  set selectedCalendar(calendar: SelectedCalendar) {
    this.storage.set("selected-calendar", calendar).then(() => {
      this._selectedCalendar = calendar;
    });
  }

  //getter and setter for cardViewType
  private _selectedViewType: string = CardViewTypes.VIEW_TYPE_QRCODE;
  get selectedViewType() {
    return this._selectedViewType;
  }
  set selectedViewType(viewType: string) {
    this.storage.set("selected-view-type", viewType).then(() => {
      this._selectedViewType = viewType;
    });
  }
}
