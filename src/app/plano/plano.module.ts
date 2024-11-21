import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PlanoPageRoutingModule } from "./plano-routing.module";

import { PlanoPage } from "./plano.page";
import { SharedDirectivesModule } from "./../directives/shared-directives.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlanoPageRoutingModule, SharedDirectivesModule],
  declarations: [PlanoPage],
})
export class PlanoPageModule {}
