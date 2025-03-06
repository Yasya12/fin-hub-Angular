import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environment';
import { CreatePost } from '../models/create-post';
import { Observable } from 'rxjs';
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
