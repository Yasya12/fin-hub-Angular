import { Injectable } from '@angular/core';
import { ValidationError } from '../../core/models/interfaces/validation-error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleHttpError(err: any): string {
    if (!err || !err.status) {
      return 'Сталася неочікувана помилка. Спробуйте ще раз.';
    }

    switch (err.status) {
      case 400:
        if (err.error?.error) {
          return err.error.error;
        }
        return this.formatValidationErrors(err.error?.errors);
      case 401:
        return 'Неправильна електронна пошта або пароль. Спробуйте ще раз.';
      case 409:
        return 'Ця електронна пошта вже використовується. Будь ласка, використайте іншу.';
      case 500:
        return 'Помилка сервера. Спробуйте пізніше.';
      default:
        return 'Щось пішло не так. Перевірте введені дані і спробуйте ще раз.';
    }
  }

  formatValidationErrors(errors: ValidationError): string {
    if (!errors) return 'Невірні дані. Перевірте правильність заповнення.';
    
    return Object.values(errors)
      .flat()
      .join('\n\n'); 
  }  
}
