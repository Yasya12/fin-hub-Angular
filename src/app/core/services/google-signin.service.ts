import { Injectable } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {

  constructor(private authService: AuthService,
              private router: Router
  ) { }

  loadSdk(): void {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
    }
  }

  handleCredentialResponse(response: any): void {
    const token = response.credential;

    // Decode the token to check its payload (optional, for debugging)
    const responsePayload = JSON.parse(atob(token.split(".")[1]));
    console.log(responsePayload);

    // Save the user details in sessionStorage
    sessionStorage.setItem('loggedinUser', JSON.stringify(responsePayload));

    // Call the Google login API
    this.authService.googleLogin({ token }).subscribe({
      next: (data) => {
        console.log('Successful authentication:', data);
        // Save the received JWT token in localStorage
        localStorage.setItem('token', data.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Authentication error:', error);
      },
    });
  }
}
