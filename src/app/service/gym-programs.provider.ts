import { MapperService } from "./utils/mapper.service";
import { GymProgram, Plano } from "../models/interfaces/gym-program.interface";
import { GymProgramsConfiguration } from "../models/gym-programs-configuration";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GymListing } from "../models/gym-listing";
import { InfoMessages } from "../models/interfaces/info-messages.interface";
import { GymListingNew } from "../models/gym-listing.new";
import { format } from "date-fns";
import { PlanoDetails } from "../models/interfaces/plano-details.interface";
import { AlertController } from "@ionic/angular";
// TODO: Replace @ionic-native/local-notifications
//COMPLETE
// import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
//TODO: Must remove this declate. Do not use local-Notification
// import { LocalNotifications } from '@capacitor/local-notifications';
import {Calendar, CalendarOptions} from "@awesome-cordova-plugins/calendar/ngx";
import { Observable } from "rxjs";
import { AppStateProvider } from "./app-state";
import { OssAuthServiceExtension } from "./extension/oss-auth-service-extension";
import { ContractsInfoDto } from "../models/interfaces/gym-contract.interface";
import { Network } from "@capacitor/network";

@Injectable({
  providedIn: "root",
})
export class GymProgramsProvider {
  configuration: GymProgramsConfiguration;
  constructor(
    public http: HttpClient,
    // private network: Network,
    private appState: AppStateProvider,
    // private localNotifications: LocalNotifications,
    private ossAuthExtension: OssAuthServiceExtension,
    private alertCtrl: AlertController,
    private calendar: Calendar,
    private mapper: MapperService
  ) {
    const self = this;
    this.configuration = {
      // gymProgramsTodayUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/all/day/",
      // gymProgramsWeekUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/all/week/",
      // gymProgramsMonthUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/all/month/",
      // gymMyProgramsTodayUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/my/day/",
      // gymMyProgramsWeekUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/my/week/",
      // gymMyProgramsMonthUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/plana/my/month/",
      // gymProgramBookNowUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/book/",
      // gymProgramCancelUrl: "http://www.retailopen.gr/OPSWWEBREST/opsw/erp/gymn/web/rest/cancel/",

      get explorePlanaDayUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/gyplana/v1`;
      },
      get myScheduleUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/gyplana/v1`;
      },
      get planoDetailsUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/gyplana/v1`;
      },
      get exploreDayUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/all/day/`;
      },
      get exploreWeekUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/all/week/`;
      },
      get exploreMonthUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/all/month/`;
      },
      get myScheduleDayUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/my/day/`;
      },
      get myScheduleWeekUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/my/week/`;
      },
      get myScheduleMonthUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/plana/my/month/`;
      },
      get infoMessagesUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/grammateia/alerts/`;
      },
      get gymProgramBookNowUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/gybook/`;
      },
      get gymProgramCancelUrl() {
        return `http://rest.oss.gr:8181/${self.ossAuthExtension.getOssApiRouting()}/gycancel/`;
      },
    };
  }

  async loadExplorePlanaDay(selectedDate: Date, completeCallback: Function): Promise<void> {
    if (!(await this.networkConnected())) {
      if (completeCallback) completeCallback();
      return;
    }
    console.log(";Έλεγχος για το πεδίο ossClientId ", this.ossAuthExtension.getOssClientId());

    if (!this.ossAuthExtension.getOssClientId()) {
      if (completeCallback) completeCallback();
      return;
    }

    (<Observable<GymListingNew>>(
      this.http.get(
        this.configuration.explorePlanaDayUrl +
          `?date=${format(selectedDate, "YYYY-MM-DD")}&cmacco=${this.ossAuthExtension.getOssClientId()}`
      )
    )).subscribe((data) => {
      this.appState.explorePlanaDay.mapLists(data);
      if (completeCallback) {
        completeCallback();
      }
    });
  }

  getGymsWebSites(): Observable<{gyms: {code: number, site: string}[]}> {
    return this.http.get("assets/gyms.json") as Observable<{gyms: {code: number, site: string}[]}>;
  }

  async loadMySchedule(completeCallback: Function, fromDate?: Date): Promise<void> {
    if (!(await this.networkConnected())) {
      if (completeCallback) completeCallback();
      return;
    }

    if (!this.ossAuthExtension.getOssClientId()) {
      if (completeCallback) completeCallback();
      return;
    }

    (<Observable<GymListingNew>>(
      this.http.get(
        this.configuration.myScheduleUrl +
          `?cmacco=${this.ossAuthExtension.getOssClientId()}&booksw=my&date=${
            fromDate ? format(fromDate, "YYYY-MM-DD") : ""
          }`
      )
    )).subscribe((data) => {
      this.appState.mySchedule.mapLists(data);
      if (completeCallback) {
        completeCallback();
      }
    });
  }
  getPlanoDetails(gyplId: number): Observable<PlanoDetails> {
    // if (!this.networkConnected()) {
    //   return;
    // }

    return <Observable<PlanoDetails>>this.http.get(this.configuration.planoDetailsUrl + `?gyplid=${gyplId}`);
  }

  loadExploreDay(completeCallback: Function): void {
    this.loadGenericListing(this.configuration.exploreDayUrl, this.appState.exploreDay, completeCallback);
  }

  loadExploreWeek(completeCallback: Function): void {
    this.loadGenericListing(this.configuration.exploreWeekUrl, this.appState.exploreWeek, completeCallback);
  }

  loadExploreMonth(completeCallback: Function): void {
    this.loadGenericListing(this.configuration.exploreMonthUrl, this.appState.exploreMonth, completeCallback);
  }

  async loadInfoMessages(completeCallback: Function): Promise<void> {
    if (!(await this.networkConnected())) {
      if (completeCallback) completeCallback();
      return;
    }

    (<Observable<InfoMessages>>(
      this.http.get(this.configuration.infoMessagesUrl + this.ossAuthExtension.getOssClientId())
    )).subscribe((data) => {
      this.appState.infoMessages = data;
      completeCallback();
    });
  }

  async loadContractsInfoMessages(completeCallback: Function): Promise<void> {
    if (!(await this.networkConnected())) {
      if (completeCallback) completeCallback();
      return;
    }

    (<Observable<ContractsInfoDto>>(
      this.http.get(
        `${this.configuration.infoMessagesUrl}${this.ossAuthExtension.getOssClientId()}/?dosw=mycontracts`
      )
    )).subscribe((data) => {
      this.appState.constractData = this.mapper.getContracts(data);
      completeCallback();
    });
  }

  loadMyScheduleDay(completeCallback: Function): void {
    this.loadGenericListing(
      this.configuration.myScheduleDayUrl,
      this.appState.myScheduleDay,
      completeCallback
    );
  }

  loadMyScheduleWeek(completeCallback: Function): void {
    this.loadGenericListing(
      this.configuration.myScheduleWeekUrl,
      this.appState.myScheduleWeek,
      completeCallback
    );
  }

  loadMyScheduleMonth(completeCallback: Function): void {
    this.loadGenericListing(
      this.configuration.myScheduleMonthUrl,
      this.appState.myScheduleMonth,
      completeCallback
    );
  }

  private async networkConnected(): Promise<boolean> {
    const netType = await (await Network.getStatus()).connectionType;
    if (!netType || netType.toLowerCase() != "none") return true;

    let alert = await this.alertCtrl.create({
      header: "Network",
      subHeader: "Whoops! You're currently offline.",
      message: "Try again later",
      buttons: ["Ok"],
    });
    alert.present();

    return false;
  }

  private async loadGenericListing(url: string, destination: GymListing, completeCallback: Function) {
    if (!(await this.networkConnected())) {
      if (completeCallback) completeCallback();
      return;
    }

    if (!this.ossAuthExtension.getOssClientId()) {
      if (completeCallback) completeCallback();
      return;
    }

    (<Observable<GymListing>>this.http.get(url + this.ossAuthExtension.getOssClientId())).subscribe(
      (data) => {
        destination.mapLists(data);
        // console.log(data);
        if (completeCallback) {
          completeCallback();
        }
      }
    );
  }

  bookOrCancelBooking(
    gymProgram: GymProgram,
    bookingFlag: boolean,
    reloadMyScheduleData: boolean,
    successCallback: Function
  ) {
    if (!this.networkConnected() || !this.ossAuthExtension.getOssClientId()) return false;

    let url = bookingFlag ? this.configuration.gymProgramBookNowUrl : this.configuration.gymProgramCancelUrl;
    url += gymProgram.gyplId + "/" + this.ossAuthExtension.getOssClientId();
    this.http.post<GymProgram>(url, null).subscribe(
      (response: GymProgram) => {
        gymProgram.status1 = response.status1;
        gymProgram.status1descr = response.status1descr;
        gymProgram.status2 = response.status2;
        gymProgram.status2descr = response.status2descr;
        gymProgram.action = response.action;

        this.successBookingOrCancelBooking(gymProgram, bookingFlag, reloadMyScheduleData);
        successCallback();
      },
      async (error) => {
        if (error instanceof HttpErrorResponse && error.status == 400) {
          let alert = await this.alertCtrl.create({
            header: "Action Failed!",
            subHeader: error.error,
            buttons: ["Ok"],
          });
          alert.present();
        } else throw error;
      }
    );
    return true;
  }

  bookOrCancelBookingNew(
    plano: Plano,
    bookingFlag: boolean,
    reloadMyScheduleData: boolean,
    successCallback: Function
  ) {
    if (!this.networkConnected() || !this.ossAuthExtension.getOssClientId()) return false;

    let url = bookingFlag ? this.configuration.gymProgramBookNowUrl : this.configuration.gymProgramCancelUrl;
    url += plano.gyId + "/" + this.ossAuthExtension.getOssClientId();
    this.http.post<Plano>(url, null).subscribe(
      (response: Plano) => {
        plano.sta1 = response.sta1;
        plano.std1 = response.std1;
        plano.sta2 = response.sta2;
        plano.std2 = response.std2;
        plano.acti = response.acti;

        this.successBookingOrCancelBookingNew(plano, bookingFlag, reloadMyScheduleData);
        successCallback();
      },
      async (error) => {
        if (error instanceof HttpErrorResponse && error.status == 400) {
          let alert = await this.alertCtrl.create({
            header: "Action Failed!",
            subHeader: error.error,
            buttons: ["Ok"],
          });
          alert.present();
        } else throw error;
      }
    );
    return  true;
  }

  private successBookingOrCancelBooking(
    gymProgram: GymProgram,
    bookingFlag: boolean,
    reloadMyScheduleData: boolean
  ) {
    this.appState.updateGymProgramToAllLists(gymProgram);

    if (reloadMyScheduleData) {
      this.reloadMyScheduleDataSmart(bookingFlag);
    }
    //place notification
    if (!bookingFlag || this.appState.appPreferences.useLocalNotifications) {
      // this.placeOrCancelNotification(gymProgram, bookingFlag);
    }
    // place calendar event
    if (
      bookingFlag &&
      this.appState.appPreferences.useCalendar &&
      this.appState.appPreferences.selectedCalendar
    ) {
      this.addCalendarEvent(this.appState.appPreferences.selectedCalendar, gymProgram);
    }
  }

  private successBookingOrCancelBookingNew(
    plano: Plano,
    bookingFlag: boolean,
    reloadMyScheduleData: boolean
  ) {
    this.appState.updatePlanoToAllLists(plano);

    if (reloadMyScheduleData) {
      this.reloadMyScheduleData();
    }
    //place notification
    if (!bookingFlag || this.appState.appPreferences.useLocalNotifications) {
      //this.placeOrCancelNotificationNew(plano, bookingFlag);
    }
    // place calendar event
    if (
      bookingFlag &&
      this.appState.appPreferences.useCalendar &&
      this.appState.appPreferences.selectedCalendar
    ) {
      this.addCalendarEventNew(this.appState.appPreferences.selectedCalendar, plano);
    }
  }

  private reloadMyScheduleDataSmart(cameFromBooking: boolean): void {
    if (this.appState.myScheduleDay.plana.length !== 0 || cameFromBooking) {
      this.loadMyScheduleDay(null!);
    }
    if (this.appState.myScheduleWeek.plana.length !== 0 || cameFromBooking) {
      this.loadMyScheduleWeek(null!);
    }
    if (this.appState.myScheduleMonth.plana.length !== 0 || cameFromBooking) {
      this.loadMyScheduleWeek(null!);
    }
  }

  private reloadMyScheduleData(): void {
    this.loadMySchedule(null!);
  }

  // TODO: Check this method because use locaNotification
  //COMPLETE
  private placeOrCancelNotification(gymProgram: GymProgram, placeNotification: boolean) {
    // if (placeNotification) {
    //   // Schedule delayed notification
    //   LocalNotifications.schedule({
    //     notifications: [
    //       {
    //         id: gymProgram.gyplId,
    //         title: gymProgram.mathimaDescr,
    //         body: `${gymProgram.gymnasthsName} - ${gymProgram.aithousaDescr} - ${new Date(
    //           gymProgram.dateBegin
    //         ).toLocaleString("el-GR")}`,
    //         //trigger: { at: new Date(new Date(gymProgram.dateBegin).getTime() - 3600 * 1000) },
    //         //trigger: { at: new Date(new Date().getTime() + 10 * 1000) },
    //         //led: "F33799",
    //         sound: null,
    //         //foreground: true,
    //       }
    //     ]
    //   });
    // } else {
    //   //clear & cancel previous notification for this gymProgram
    //   //this.localNotifications.clear(gymProgram.gyplId);
    //   LocalNotifications.cancel({
    //     notifications:[{
    //       id: gymProgram.gyplId
    //     }]
    //   });
    // }
  }

  // TODO: Check this method because use locaNotification
  private placeOrCancelNotificationNew(plano: Plano, placeNotification: boolean) {
    // if (placeNotification) {
    //   // Schedule delayed notification
    //   LocalNotifications.schedule({
    //     notifications: [
    //       {
    //         id: plano.gyId,
    //         title: plano.mathimaDescr,
    //         body: `${plano.gymnasthsName} - ${plano.aithousaDescr} - ${new Date(plano.dtBe).toLocaleString(
    //           "el-GR"
    //         )}`,
    //         //trigger: { at: new Date(new Date(plano.dtBe).getTime() - 3600 * 1000) },
    //         //trigger: { at: new Date(new Date().getTime() + 10 * 1000) },
    //         //led: "F33799",
    //         sound: null,
    //         //foreground: true,
    //       }
    //     ]
    //   });
    // } else {
    //   //clear & cancel previous notification for this gymProgram
    //   //this.localNotifications.clear(plano.gyId);
    //   LocalNotifications.cancel({
    //     notifications: [{
    //       id: plano.gyId
    //     }]
    //   });
    // }
  }


  addCalendarEvent(cal: any, gymProgram: GymProgram) {
    let startDate = new Date(gymProgram.dateBegin);
    let endDate = new Date(gymProgram.dateEnd);
    let options: CalendarOptions = {
      calendarId: cal.id,
      calendarName: cal.name,
      // url: "http://www.openfitness.gr",
      firstReminderMinutes: 40,
      secondReminderMinutes: 20,
    };

    this.calendar
      .createEventWithOptions(
        `Open Fitness - ${gymProgram.mathimaDescr}`,
        gymProgram.aithousaDescr,
        `${gymProgram.mathimaDescr} w/${gymProgram.gymnasthsName}`,
        startDate,
        endDate,
        options
      )
      .then(() => {});
  }

  addCalendarEventNew(cal: any, plano: Plano) {
    let startDate = new Date(plano.dtBe);
    let endDate = new Date(plano.dtEn);
    let options: CalendarOptions = {
      calendarId: cal.id,
      calendarName: cal.name,
      // url: "http://www.openfitness.gr",
      firstReminderMinutes: 40,
      secondReminderMinutes: 20,
    };

    this.calendar
      .createEventWithOptions(
        `Open Fitness - ${plano.mathimaDescr}`,
        plano.aithousaDescr,
        `${plano.mathimaDescr} w/${plano.gymnasthsName}`,
        startDate,
        endDate,
        options
      )
      .then(() => {});
  }
}
