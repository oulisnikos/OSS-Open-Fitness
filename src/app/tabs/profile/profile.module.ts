import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfilePageRoutingModule } from "./profile-routing.module";

import { ProfilePage } from "./profile.page";
import { CoreModule } from "src/app/service/auth/core/core.module";
import { PushNotificationsService } from "src/app/service/push-notifications.service";
// import { AppVersion } from "@ionic-native/app-version/ngx";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule, CoreModule],
  declarations: [ProfilePage],
  providers: [PushNotificationsService],
})
export class ProfilePageModule {}
