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

  private handleAuthResponse(response: ResponseModel): void {
    if (response) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      this.currentUser.set(response);
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
    this.currentUser.set(null);
  }

  googleLogin(tokenRequest: { token: string }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/auth/google`, tokenRequest);
  }
}
