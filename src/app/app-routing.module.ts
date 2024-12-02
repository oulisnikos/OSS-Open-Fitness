import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './service/core/auth-guard.service';

const routes: Routes = [
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full"
  },
  {
    path: "landing",
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingPageModule),
  },
  {
    path: "tabs",
    canActivate: [AuthGuardService],
    loadChildren: () => import("./tabs/tabs.module").then(m => m.TabsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
