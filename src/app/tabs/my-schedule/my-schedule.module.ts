import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MySchedulePageRoutingModule } from "./my-schedule-routing.module";
import { MySchedulePage } from "./my-schedule.page";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MySchedulePageRoutingModule,
  ],
  declarations: [
    MySchedulePage,
  ],
})
export class MySchedulePageModule {}
