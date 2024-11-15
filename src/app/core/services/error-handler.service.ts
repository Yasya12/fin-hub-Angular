import { Injectable } from '@angular/core';
import {ValidationError} from "../models/validation-error.model";

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  formatErrors(errors: ValidationError): string {
    let errorMessages = '';
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        errors[field].forEach((message) => {
          errorMessages += `${field}: ${message}\n`;
        });
      }
    }
    return errorMessages;
  }
}
