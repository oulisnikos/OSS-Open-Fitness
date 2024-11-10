import { Observable } from "rxjs";

export interface OssAuth {
  getAccessToken(): string;
  getOssClientId(): number;
  getOssApiRouting(): string;
  refreshTokenAndReturnTheToken(): Observable<string> | Promise<string>;
  login():Promise<void>;
  logout():Promise<void>;
  getUserInfo():Observable<any>;
}
