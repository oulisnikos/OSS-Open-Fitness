export const CardViewTypes = {
  VIEW_TYPE_BARCODE: "barcode",
  VIEW_TYPE_QRCODE: "qrcode"
};
export interface ContractsInfoDto {
  result: ContractInfoDto[];
}

export interface ContractInfoDto {
  fieldName: string;
  label: string;
  valueNum: number;
  valueStr: string;
  valueArr: ContractInfoDto[];
}

export interface ContractsInfo {
  contracts: ContractInfo[];
  cardInfo: CardInfo[];
}

export interface CardInfo {
  caption: string;
  cardNumber: string;
  cardType?: string;
}

export interface ContractInfo {
  characteristicTag: string;
  contractCaption: string;
  detailRows: ContractRowInfo[];
}

export interface ContractRowInfo {
  characteristicTag: string;
  caption: string;
  valueLblNumber?: number;
  valueLblString?: string;
}
