import { Injectable } from "@angular/core";
import { isEqual } from "date-fns";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  public getDateWithoutTime(d: Date): Date {
    let cleanedDate: Date;
    if (d) {
      cleanedDate = new Date(d);
      cleanedDate.setHours(0, 0, 0, 0);
    }
    return cleanedDate;
  }
  public isEqualDatePart(date1: Date, date2: Date) {
    return isEqual(this.getDateWithoutTime(date1), this.getDateWithoutTime(date2));
  }
}
