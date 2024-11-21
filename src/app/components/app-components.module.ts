import { PlanoFilterComponent } from './plano-filter/plano-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { FancyDatePickerComponent } from "./fancy-date-picker/fancy-date-picker.component";

@NgModule({
  declarations: [
    FancyDatePickerComponent,
    PlanoFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    FancyDatePickerComponent,
    PlanoFilterComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponentsModule {}
