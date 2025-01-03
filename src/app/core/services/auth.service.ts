import { Injectable, signal } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User/user.model.";
import {BehaviorSubject, Observable, tap} from "rxjs";
import { Login } from '../models/login.model';
import { FullUser } from '../models/User/full_user.model';

export interface GoogleLoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<FullUser | null>(null);
  
  constructor(private http: HttpClient) { }

  signup(credentials: User) : Observable<object> {
    return this.http.post("http://localhost:8080/api/user", credentials)
  }

  login(credentials: Login): Observable<object> {
    return this.http.post("http://localhost:8080/api/auth/login", credentials).pipe(
      tap((response: any) => { //type any change
        if (response) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUser.set(response);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  googleLogin(tokenRequest: { token: string }): Observable<GoogleLoginResponse> {
    return this.http.post<GoogleLoginResponse>("http://localhost:8080/api/auth/google", tokenRequest);
  }
}
