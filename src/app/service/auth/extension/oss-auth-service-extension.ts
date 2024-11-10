import { jwtDecode } from 'jwt-decode';
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, from, Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IOssAuth } from "./oss-auth.interface";
import { AuthService } from "ionic-appauth";
import { TokenResponse } from "@openid/appauth";

@Injectable({
  providedIn: "root",
})
export class OssAuthServiceExtension implements IOssAuth, OnDestroy {
  token$: Subscription;
  tokenResponse!: TokenResponse;
  constructor(private auth: AuthService) {
    this.token$ = auth.token$.subscribe((tokenResponse) => {
      console.log("current Access Token", tokenResponse?.accessToken);
      this.tokenResponse = tokenResponse;
    });
  }

  ngOnDestroy(): void {
    if (this.token$) {
      console.log("unsubscribe token$ on interceptor");
      this.token$.unsubscribe();
    }
  }

  getOssClientId(): number {
    return this.getIdTokenObject()?.mobile_client_id;
  }

  getOssApiRouting(): string {
    return this.getIdTokenObject()?.mobile_api_routing;
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
    return jwtDecode(this.tokenResponse.accessToken);
  }

  public getIdTokenObject(): any {
    if (!this.tokenResponse || !this.tokenResponse.idToken) {
      return null;
    }

    return jwtDecode(this.tokenResponse.idToken);
  }

  public getOssUserName(): string {
    return this.getIdTokenObject().preferred_username;
  }
}
