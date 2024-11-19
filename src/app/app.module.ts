import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './service/auth/core/core.module';
import { PushNotificationsService } from './service/push-notifications.service';
import { AppErrorHandler } from './service/app-error-handler';
import { RequestInterceptorService } from './service/request-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(), 
    CoreModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: ErrorHandler, useClass: AppErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
    PushNotificationsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
