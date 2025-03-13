import { Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Login } from '../models/login.model';
import { Signup } from '../models/signup.model';
import { ResponseModel } from '../models/response.model';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<ResponseModel | null>(null);
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  handleAuthResponse(response: ResponseModel): void {
    if (response) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      this.currentUser.set(response);
      const expiration = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('token_expiration', expiration.toString());
      this.startLogoutTimer();
    }
  }

  signup(credentials: Signup): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/auth/signup`, credentials).pipe(
      tap(this.handleAuthResponse.bind(this))
    );
  }

  login(credentials: Login): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(this.handleAuthResponse.bind(this))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    this.currentUser.set(null);
  }

  googleLogin(tokenRequest: { token: string }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/auth/google`, tokenRequest);
  }

  startLogoutTimer() {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return;
  
    const timeLeft = +expiration - Date.now();
    if (timeLeft > 0) {
      setTimeout(() => this.logout(), timeLeft);
    } else {
      this.logout();
    }
  }
  
  checkTokenExpiration(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const expiration = localStorage.getItem('token_expiration');
      const token = localStorage.getItem('token');
  
      if (!token || !expiration) {
        // No token or expiration found, logout
        this.logout();
        return;
      }
  
      const timeLeft = +expiration - Date.now();
      if (timeLeft <= 0) {
        // Token expired, logout
        this.logout();
      }
    }
  }
}
