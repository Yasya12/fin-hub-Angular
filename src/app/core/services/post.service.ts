import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {Post} from "../models/post.model";
import {SinglePost} from "../models/single_post.model";
import { PostResponse } from '../models/post_response';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<PostResponse>('http://localhost:8080/api/post').pipe(
      map((response) => response.items) 
    );
  }

  getPostById(id: string): Observable<SinglePost> {
    return this.http.get<SinglePost>(`${'http://localhost:8080/api/post'}/${id}`);
  }

  toggleLike(postId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`http://localhost:8080/api/Like/toggle-like/${postId}`, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
  isPostLiked(postId: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Перевірка, чи є токен перед відправкою запиту
    if (!token) {
      return new Observable(observer => {
        observer.error('Token not found');
      });
    }
    // Виконуємо запит до API з заголовком авторизації
    return this.http.get<any>(`http://localhost:8080/api/Like/is-liked/${postId}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
}
