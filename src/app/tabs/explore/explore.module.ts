import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AppComponentsModule } from "./../../components/app-components.module";
import { ExplorePageRoutingModule } from "./explore-routing.module";
import { ExplorePage } from "./explore.page";
import { PlanoPage } from "src/app/plano/plano.page";
import { PlanoPageModule } from "src/app/plano/plano.module";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ExplorePageRoutingModule, AppComponentsModule, PlanoPageModule],
  declarations: [ExplorePage],
})
export class ExplorePageModule {}
