import { Injectable } from "@angular/core";
import { CallNumber } from "capacitor-call-number";


@Injectable({
    providedIn: "root"
})
export class OpswCallNumber {
    constructor() {

    }

    async call_number(phoneNumber: string) {
        try {
            await CallNumber.call({
              number: phoneNumber,
              bypassAppChooser: false
            });
        } catch (error) {
            throw error;
        }
    }
}