import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MySchedulePage } from "./my-schedule.page";

const routes: Routes = [
  {
    path: "",
    component: MySchedulePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySchedulePageRoutingModule {}
