import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Post } from '../../core/models/interfaces/post/post.interface';
import { SinglePost } from '../../features/post-detail/models/interfaces/single-post.interface';
import { PostResponse } from '../../core/models/interfaces/post/post_response.interface';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../models/interfaces/pagination.model';
import { response } from 'express';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  //Services
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  //States
  private baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Post[]> | undefined>(undefined);

  getPosts(pageNumber: number, pageSize: number): Observable<HttpResponse<Post>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http
      .get<Post>(`${this.baseUrl}/post`, {
        observe: 'response', params, headers: { 'Cache-Control': 'no-cache' },
        transferCache: { includeHeaders: ['Pagination'] }
      }).pipe(
        tap(response => {
          const paginationHeader = response.headers.get('Pagination');
          this.paginatedResult.set({
            items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
            pagination: JSON.parse(paginationHeader!),
          });
        }
        )
      )
  }

  getPostsWithLikes(
    pageNumber: number,
    pageSize: number
  ): Observable<HttpResponse<Post>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
      .set('Cache-Control', 'no-cache');


    return this.http
      .get<Post>(`${this.baseUrl}/post/with-likes`, {
        observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
      }).pipe(
        tap(response => {
          const paginationHeader = response.headers.get('Pagination');
          this.paginatedResult.set({
            items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
            pagination: JSON.parse(paginationHeader!),
          });
        }
        )
      )
  }

  getPostById(id: string): Observable<SinglePost> {
    return this.http.get<SinglePost>(`${this.baseUrl}/post/${id}`);
  }
}
