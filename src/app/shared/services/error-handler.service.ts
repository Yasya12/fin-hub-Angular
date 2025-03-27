import { Injectable } from '@angular/core';
import { ValidationError } from '../../core/models/interfaces/validation-error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleHttpError(err: any): string {
    if (!err || !err.status) {
      return 'An unexpected error occurred. Please try again.';
    }

    switch (err.status) {
      case 400:
        if (err.error?.error) {
          return err.error.error;
        }
        return this.formatValidationErrors(err.error?.errors);
      case 401:
        return 'Invalid email or password. Please try again.';
      case 409:
        return 'This email is already in use. Please use another email.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'Something went wrong. Please check your input and try again.';
    }
  }

  formatValidationErrors(errors: ValidationError): string {
    if (!errors) return 'Invalid input. Please check your data.';
    
    return Object.values(errors)
      .flat()
      .join('\n\n'); 
  }  
}
