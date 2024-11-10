import { ContractsInfo, ContractsInfoDto, ContractRowInfo, CardInfo } from './../../models/interfaces/gym-contract.interface';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MapperService {
  constructor() {}

  public getContracts(contractsDto: ContractsInfoDto): ContractsInfo {
    let cardInf: CardInfo[] = [];
    const contVar: ContractsInfo = {
      contracts: [],
      cardInfo: [],
    };

    if (contractsDto && contractsDto.result) {
      contractsDto.result.forEach((cont) => {
        if (cont.fieldName === "card") {
          cardInf.push({
            caption: cont.label,
            cardNumber: cont.valueStr,
            cardType: "qr",
          });
        } else if (cont.fieldName === "card-bc") {
          cardInf.push({
            caption: cont.label,
            cardNumber: cont.valueStr,
            cardType: "bc",
          });
        } else {
          const contRows: ContractRowInfo[] = [];
          if (cont.valueArr) {
            cont.valueArr.forEach((cont1) => {
              contRows.push({
                characteristicTag: cont1.fieldName || "",
                caption: cont1.label || "",
                valueLblNumber: cont1.valueNum || 0,
                valueLblString: cont1.valueStr || "",
              })
            });
          }

          contVar.contracts.push({
            characteristicTag: cont.fieldName,
            contractCaption: cont.label,
            detailRows: contRows,
          });
        }
      });
    }

    if (cardInf) {
      contVar.cardInfo = cardInf;
    }

    return contVar;
  }
}
