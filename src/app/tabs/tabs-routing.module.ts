import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "messages",
        loadChildren: () => import("./messages/messages.module").then((m) => m.MessagesPageModule),
      },
      {
        path: "explore",
        loadChildren: () => import("./explore/explore.module").then((m) => m.ExplorePageModule),
      },
      {
        path: "my-schedule",
        loadChildren: () => import("./my-schedule/my-schedule.module").then((m) => m.MySchedulePageModule),
      },
      {
        path: "profile",
        loadChildren: () => import("./profile/profile.module").then((m) => m.ProfilePageModule),
      },
      {
        path: "contracts",
        loadChildren: () => import("./contracts/contracts.module").then((m) => m.ContractsPageModule),
      },
      {
        path: "",
        redirectTo: "tabs/explore",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "tabs/explore",
    pathMatch: "full",
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfilePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
