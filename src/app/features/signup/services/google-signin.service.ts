import { Injectable, NgZone, signal } from '@angular/core';
import {AuthService} from "./auth.service";
import { Router } from '@angular/router';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {
  currentUser = signal<ResponseModel | null>(null);

  constructor(private authService: AuthService,
              private router: Router,
              private ngZone: NgZone,
  ) { this.loadSdk();}

  loadSdk(): void {
    if (typeof window !== 'undefined') {
      // Додаємо функцію до глобального простору до завантаження скрипту
      (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
  
      document.body.appendChild(script);
    }
  }

  private handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      if (response.credential) {
        const token = response.credential;

        try {
          const tokenParts = token.split('.');
          const decodedPayload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded Payload:', decodedPayload);

          sessionStorage.setItem('loggedinUser', JSON.stringify(decodedPayload));

          this.authService.googleLogin({ token }).subscribe({
            next: (data) => {
              console.log('Успішна автентифікація:', data);
              this.authService.handleAuthResponse(data);
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Помилка автентифікації:', error);
            }
          });
        } catch (error) {
          console.error('Помилка обробки токену:', error);
        }
      } else {
        console.error('Credential не отриманий');
      }
    });
  }
}
