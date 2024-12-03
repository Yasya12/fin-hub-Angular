import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model.";
import {Observable} from "rxjs";

export interface GoogleLoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(credentials: User) : Observable<object> {
    return this.http.post("http://localhost:8080/api/user", credentials)
  }

  googleLogin(tokenRequest: { token: string }): Observable<GoogleLoginResponse> {
    return this.http.post<GoogleLoginResponse>("http://localhost:8080/api/auth/google", tokenRequest);
  }

}
