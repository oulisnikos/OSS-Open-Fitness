import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfilePageRoutingModule } from "./profile-routing.module";

import { ProfilePage } from "./profile.page";
import { PushNotificationsService } from "src/app/service/push-notifications.service";
import { SettingsPage } from "src/app/settings/settings.page";
// import { AppVersion } from "@ionic-native/app-version/ngx";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule],
  declarations: [ProfilePage, SettingsPage],
  providers: [PushNotificationsService],
})
export class ProfilePageModule {}
