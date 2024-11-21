import { Injectable, OnDestroy } from "@angular/core";
import { Observable, from, Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IOssAuth, IOssAuthUser } from "./oss-auth.interface";
import { AuthService } from "ionic-appauth";
import { TokenResponse } from "@openid/appauth";

@Injectable({
  providedIn: "root",
})
export class OssAuthServiceExtension implements IOssAuth, OnDestroy {
  user$ = this.auth.user$;
  userSub: Subscription;
  token$ = this.auth.token$;
  tokenSub: Subscription;
  tokenResponse!: TokenResponse;
  userInfo!: IOssAuthUser;
  constructor(private auth: AuthService) {
    this.tokenSub = this.token$.subscribe((tokenResponse) => {
      console.log("current Access Token", tokenResponse?.accessToken);
      this.tokenResponse = tokenResponse;
    });
    this.userSub = this.user$.subscribe((connected) => {
      console.log("Current connected user. ", connected);
      this.userInfo = {...connected};
    });
  }

  ngOnDestroy(): void {
    if (this.tokenSub) {
      console.log("unsubscribe token$ on interceptor");
      this.tokenSub.unsubscribe();
    }
    if (this.userSub) {
      console.log("unsubscribe user$ on interceptor");
      this.userSub.unsubscribe();
    }
  }

  async getConnectedUser() {
    await this.auth.loadUserInfo();
  }

  getOssClientId(): number {
    return this.userInfo.mobile_client_id;
    // OLD
    //return this.getIdTokenObject()?.mobile_client_id;
  }

  getOssApiRouting(): string {
    return this.userInfo.mobile_api_routing;
    // OLD
    //return this.getIdTokenObject()?.mobile_api_routing;
  }

  public getAccessToken(): string {
    if (!this.tokenResponse) {
      return null!;
    }
    return this.tokenResponse.accessToken;
  }

  public refreshTokenAndReturnTheToken(): Observable<string> {
    return from(this.auth.refreshToken()).pipe(
      switchMap(() => {
        return this.auth.token$;
      }),
      map((tokenResponse) => {
        console.log("token refreshed", tokenResponse?.accessToken);
        return tokenResponse?.accessToken;
      })
    );
  }

  //  test class only, dont have in actual app
  public getAccessTokenObject(): any {
    if (!this.tokenResponse || !this.tokenResponse.accessToken) {
      return null;
    }
    return this.tokenResponse.accessToken;//jwtDecode(this.tokenResponse.accessToken);
  }

  // public getIdTokenObject(): any {
  //   if (!this.tokenResponse || !this.tokenResponse.idToken) {
  //     return null;
  //   }

  //   return jwtDecode(this.tokenResponse.idToken);
  // }

  public getOssUserName(): string {
    return this.userInfo.preferred_username;
    // OLD
    //return this.getIdTokenObject().preferred_username;
  }
}
