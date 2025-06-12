import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Login } from '../../features/signup/models/login.model';
import { Signup } from '../../features/signup/models/signup.model';
import { ResponseModel } from '../../shared/models/interfaces/response.model';
import { environment } from '../../../environments/environment';
import { User } from '../models/interfaces/user/user.interface';
import { FullUser } from '../models/interfaces/user/full_user.interface';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO: clean the code in the service and dont user the current user here 
  currentUser = signal<ResponseModel | undefined>(undefined);
  private baseUrl = environment.apiUrl;
  private _isLoaded = signal(false);

  private presenceService = inject(PresenceService);

  constructor(private http: HttpClient) {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        // Якщо користувач з'явився (залогінився) -> створюємо з'єднання
        this.presenceService.createHubConnection(user);
      } else {
        // Якщо користувач зник (вилогінився) -> зупиняємо з'єднання
        this.presenceService.stopHubConnection();
      }
    });
}

getMember() {
  return this.http.get<User>(`${this.baseUrl}/user/by-email`, {
    headers: new HttpHeaders().set('Authorization', `Bearer ${this.currentUser()?.token}`)
  });
}

isAuthLoaded() {
  return this._isLoaded();
}

setCurerntUser(): void {
  if(typeof window === 'undefined' || !window.localStorage) {
  return;
}

const userString = localStorage.getItem('user');
const token = localStorage.getItem('token');

if (userString && token) {
  const user: User = JSON.parse(userString);
  const fullUser: FullUser = { user, token };
  this.currentUser.set(fullUser);
  this._isLoaded.set(true);
}
  }

handleAuthResponse(response: ResponseModel): void {
  if(response) {
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    this.currentUser.set(response);
    const expiration = Date.now() + 60 * 60 * 1000;
    localStorage.setItem('token_expiration', expiration.toString());
    this.startLogoutTimer();

  }
}

signup(credentials: Signup): Observable < ResponseModel > {
  return this.http.post<ResponseModel>(`${this.baseUrl}/auth/signup`, credentials).pipe(
    tap(this.handleAuthResponse.bind(this))
  );
}

login(credentials: Login): Observable < ResponseModel > {
  return this.http.post<ResponseModel>(`${this.baseUrl}/auth/login`, credentials).pipe(
    tap(this.handleAuthResponse.bind(this))
  );
}

logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('token_expiration');
  this.currentUser.set(undefined);
  this._isLoaded.set(true);
  this.presenceService.stopHubConnection();
}

googleLogin(tokenRequest: { token: string }): Observable < ResponseModel > {
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
  if(typeof window !== 'undefined' && window.localStorage) {
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
