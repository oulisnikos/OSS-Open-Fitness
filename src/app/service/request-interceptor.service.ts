import {
  throwError as observableThrowError,
  Observable,
  BehaviorSubject,
} from "rxjs";

import { take, filter, catchError, switchMap, finalize, map } from "rxjs/operators";
import { Injectable, Injector, OnDestroy } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { AuthService } from "ionic-appauth";
import { OssAuthServiceExtension } from "./extension/oss-auth-service-extension";

@Injectable({
  providedIn: "root",
})
export class RequestInterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private injector: Injector, private ossAuthExtension: OssAuthServiceExtension) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>
  > {
    // skip request other than those to the api gateway and userinfo on oath2 server
    // if (request.url.indexOf(environment.restApiPort) < 0) {
    //   console.log("bypass interceptor for " + request.url);
    //   return next.handle(request.clone());
    // }
    if (request.url.indexOf("rest.oss.gr") < 0) {
      return next.handle(request.clone());
    }

    console.warn("run interceptor");

    const authService = this.injector.get(AuthService);

    return next.handle(this.addHeaders(request, this.ossAuthExtension.getAccessToken())).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            // case 400:
            //   return this.handle400Error(error);
            case 401:
              return this.handle401Error(request, next, authService);
            default:
              return observableThrowError(error);
          }
        } else {
          return observableThrowError(error);
        }
      })
    );
  }

  addHeaders(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  // handle400Error(error) {
  //   if (error && error.status === 400 && error.error && error.error.error === "invalid_grant") {
  //     // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
  //     return this.logoutUser();
  //   }

  //   return observableThrowError(error);
  // }

  handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler,
    authService: AuthService
  ): Observable<
    HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>
  > {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next("");

      return this.ossAuthExtension.refreshTokenAndReturnTheToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return next.handle(this.addHeaders(req, newToken));
          }

          // If we don't get a new token, we are in trouble so logout.
          authService.signOut();
          return observableThrowError("invalid_grant");
        }),
        catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          authService.signOut();
          return observableThrowError("exception calling refreshToken");
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addHeaders(req, token));
        })
      );
    }
  }
}
