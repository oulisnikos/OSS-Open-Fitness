import { ContractsPage } from "./contracts.page";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponentsModule } from "./../../components/app-components.module";
import { NgxBarcode6Module } from "ngx-barcode6";
import { ContractsPageRoutingModule } from "./contracts-routing.module";
import { IonicModule } from "@ionic/angular";
import { QRCodeModule } from "angularx-qrcode";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ContractsPageRoutingModule,
    AppComponentsModule,
    QRCodeModule,
    NgxBarcode6Module,
  ],
  declarations: [
    ContractsPage,
  ]
})
export class ContractsPageModule {}
