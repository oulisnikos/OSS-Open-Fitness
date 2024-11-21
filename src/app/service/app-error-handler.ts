import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { LoggerService } from "./logger.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private logger: LoggerService) {}

  handleError(error: Error): void {
    if (
      error.stack && (error.stack.indexOf("Object.callbackFromNative") > 0 ||
      error.stack.indexOf("authorization_endpoint") > 0 ||
      error.message.indexOf("authorization_endpoint") > 0 ||
      error.stack.indexOf("plugin_not_installed") > 0)
    ) {
      console.error(error);
      return;
    }

    if (environment.production && error.name && error.name.toLowerCase().indexOf("http") >= 0) {
      this.logger.showErrorMessage("Παρουσιάστηκε σφάλμα στην επικοινωνία με τον server");
    }
    if (environment.production) {
      console.error(error.name + "->" + error.message + " -> " + error.stack);
    } else {
      if (error.message.indexOf("cordova_not_available") > 0) {
        console.error(error.name + "->" + error.message + " -> " + error.stack);
      } else {
        alert(error.name + "->" + error.message + " -> " + error.stack);
      }
    }
    // console.error(JSON.stringify(error));
    alert(JSON.stringify(error));
  }
}
