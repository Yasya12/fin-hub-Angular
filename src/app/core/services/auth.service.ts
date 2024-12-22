import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model.";
import {BehaviorSubject, Observable, tap} from "rxjs";
import { Login } from '../models/login.model';

export interface GoogleLoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userSubject = new BehaviorSubject<any>(this.getUser()); // Зберігаємо користувача в BehaviorSubject
  user$ = this.userSubject.asObservable(); 

  constructor(private http: HttpClient) { }

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  signup(credentials: User) : Observable<object> {
    return this.http.post("http://localhost:8080/api/user", credentials)
  }

  login(credentials: Login): Observable<object> {
    return this.http.post("http://localhost:8080/api/auth/login", credentials).pipe(
      tap((response: any) => {
        // Перевірка наявності користувача та токену в відповіді
        if (response && response.user && response.token) {
          // Зберігаємо користувача та токен в localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token); // Зберігаємо токен
          this.userSubject.next(response.user); 
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null); 
  }

  googleLogin(tokenRequest: { token: string }): Observable<GoogleLoginResponse> {
    return this.http.post<GoogleLoginResponse>("http://localhost:8080/api/auth/google", tokenRequest);
  }

}
