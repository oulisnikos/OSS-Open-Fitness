import { OssMessage } from "./oss-message.interface";

export interface InfoMessages {
  criticalTitle: string;
  critical: OssMessage[];
  kanonismoiTitle: string;
  kanonismoi: OssMessage[];
  sxoliaTitle:string;
  sxolia: OssMessage[]
}
