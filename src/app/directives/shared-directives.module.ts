import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnimatedFabDirective } from "./animated-fab/animated-fab.directive";

@NgModule({
  declarations: [AnimatedFabDirective],
  imports: [CommonModule],
  exports: [AnimatedFabDirective],
})
export class SharedDirectivesModule {}
