import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreatePost } from '../models/create-post';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  createPost(post: FormData): Observable<CreatePost> {
    return this.http.post<CreatePost>(`${this.baseUrl}/post`, post);
  }  
}
