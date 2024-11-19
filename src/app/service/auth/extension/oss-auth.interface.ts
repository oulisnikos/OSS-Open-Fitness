import { Observable } from "rxjs";

export interface IOssAuth {
  getAccessToken(): string;
  getOssClientId(): number;
  getOssApiRouting(): string;
  refreshTokenAndReturnTheToken(): Observable<string> | Promise<string>;
}

export interface IOssAuthUser {
  sub: string;
  name: string;
  mobile_client_id: number;
  mobile_api_routing: string;
  preferred_username: string;
  email_verified: boolean;
  email: string;
  given_name: string;
  family_name: string;
}
