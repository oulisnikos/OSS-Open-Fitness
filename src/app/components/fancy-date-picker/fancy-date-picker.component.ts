import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { addDays, isEqual, format, addMinutes } from "date-fns";
import { trigger, transition, style, animate, state, sequence } from "@angular/animations";
import { UtilsService } from "./../../service/utils/utils.service";

@Component({
  selector: "fancy-date-picker",
  templateUrl: "./fancy-date-picker.component.html",
  styleUrls: ["./fancy-date-picker.component.scss"],
  animations: [
    trigger("fadeIn", [
      // the "in" style determines the "resting" state of the element when it is visible.
      state("in", style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(
        ":enter",
        sequence([
          style({ height: 0, opacity: 0 }),
          animate(200, style({ opacity: 0, height: "130px" })),
          style({ opacity: 0 }),
          animate(400, style({ opacity: 1 })),
        ])
      ),
      // transition(":enter", [style({ opacity: 0 }), animate(500)])
    ]),
  ],
})
export class FancyDatePickerComponent implements OnInit {
  @Output()
  changed = new EventEmitter<{ dateFrom: Date; dateTo: Date }>();
  @Output()
  resize = new EventEmitter<boolean>();
  @Input()
  expanded: boolean = true;
  mainButtonText: string = "";
  allDays: Date[] = [];
  selectedDate!: Date;
  timeRange: { lower: number; upper: number } = { lower: 0 * 2, upper: 24 * 2 };
  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  currSlides: number[] = [];

  constructor(public utils: UtilsService) {}

  ngOnInit() {
    this.selectedDate = this.utils.getDateWithoutTime(new Date());
    this.updateDateFromAndDateTo();
    this.initSlides();
    this.emmitChanged();
  }

  initSlides() {
    const vdomades: number = 26;
    let selectedWeekDay = this.selectedDate.getDay() - 1;

    if (selectedWeekDay == -1) {
      selectedWeekDay = 6;
    }

    let currentDate = addDays(this.selectedDate, -selectedWeekDay);
    for (let index = 0; index < vdomades; index++) {
      this.currSlides.push(index);
    }

    for (let index = 0; index < vdomades * 7; index++) {
      this.allDays.push(this.utils.getDateWithoutTime(currentDate));
      currentDate = addDays(currentDate, 1);
    }
  }

  isEqualDate(date1: Date, date2: Date) {
    return isEqual(date1, date2);
  }

  isToday(date: Date) {
    return this.isEqualDate(this.utils.getDateWithoutTime(date), this.utils.getDateWithoutTime(new Date()));
  }

  onSelectDate(date: Date) {
    console.log("On Select Date pressed!!!");
    this.selectedDate = date;
    this.updateDateFromAndDateTo();
    //this.emmitChanged();
  }

  getDayOfWeek(date: Date) {
    return format(date, "dd");
  }

  getMonthOfDay(date: Date) {
    return format(date, "MMMM");
  }

  public getTimeFromated(date: Date) {
    if (date.getMinutes() > 0) {
      return format(date, "h:ma");
    }
    return format(date, "ha");
  }

  private getDayFromated(date: Date) {
    return this.isToday(date) ? "Today" : format(date, "ddd, MMM DD, YYYY");
  }

  public updateDateFromAndDateTo() {
    console.log("Update DateFrom and DateTo!!!");
    this.dateFrom = addMinutes(this.utils.getDateWithoutTime(this.selectedDate), this.timeRange.lower * 30);
    this.dateTo = addMinutes(this.utils.getDateWithoutTime(this.selectedDate), this.timeRange.upper * 30);
    this.emmitChanged();
  }

  private emmitChanged() {
    console.log("Emit event!!!");
    this.updateMainButtonText();
    this.changed.emit({ dateFrom: this.dateFrom, dateTo: this.dateTo });
  }

  private updateMainButtonText() {
    this.mainButtonText = `${this.getDayFromated(this.selectedDate)} from ${this.getTimeFromated(
      this.dateFrom
    )}-${this.getTimeFromated(this.dateTo)}`;
  }

  togglePicker() {
    console.log("Toggle the picker clicked eeeee !!!!!!")
    this.expanded = !this.expanded;
    this.resize.emit(this.expanded);
  }
}
