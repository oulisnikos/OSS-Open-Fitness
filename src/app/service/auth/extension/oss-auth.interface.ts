import { Observable } from "rxjs";

export interface IOssAuth {
  getAccessToken(): string;
  getOssClientId(): number;
  getOssApiRouting(): string;
  refreshTokenAndReturnTheToken(): Observable<string> | Promise<string>;
}
