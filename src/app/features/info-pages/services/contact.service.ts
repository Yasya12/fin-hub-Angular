import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  //States
  private baseUrl = environment.apiUrl;

  private authService = inject(AuthService);

  constructor(private http: HttpClient) { }

  sendContactForm(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact/send`, data);
  }

  reportPost(postId: string, reason: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

    const reportData = { postId, reason };
    return this.http.post(`${this.baseUrl}/contact/report`, reportData, { headers });
  }
}
