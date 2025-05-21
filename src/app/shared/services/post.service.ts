import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Post } from '../../features/home/models/post.interface';
import { SinglePost } from '../../features/post-detail/models/interfaces/single-post.interface';
import { PaginatedResult } from '../models/interfaces/pagination.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

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
  paginatedHubResult = signal<PaginatedResult<Post[]> | undefined>(undefined);
  paginatedFollowResult = signal<PaginatedResult<Post[]> | undefined>(undefined);

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

  getHubPosts(pageNumber: number, pageSize: number, hubId: string): Observable<HttpResponse<Post>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('hubId', hubId);

    return this.http
      .get<Post>(`${this.baseUrl}/post/hub-posts`, {
        observe: 'response', params, headers: { 'Cache-Control': 'no-cache' },
        transferCache: { includeHeaders: ['Pagination'] }
      }).pipe(
        tap(response => {
          const paginationHeader = response.headers.get('Pagination');
          this.paginatedHubResult.set({
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

  getHubPostsWithLikes(
    pageNumber: number,
    pageSize: number,
    hubId: string
  ): Observable<HttpResponse<Post>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('hubId', hubId);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
      .set('Cache-Control', 'no-cache');


    return this.http
      .get<Post>(`${this.baseUrl}/post/hub-posts-with-likes`, {
        observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
      }).pipe(
        tap(response => {
          const paginationHeader = response.headers.get('Pagination');
          this.paginatedHubResult.set({
            items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
            pagination: JSON.parse(paginationHeader!),
          });
        }
        )
      )
  }

  getFollowingPostsWithLikes(pageNumber: number, pageSize: number): Observable<HttpResponse<Post>> {
    if (!this.authService.currentUser()?.token) {
            return of(new HttpResponse<Post>({ status: 401 }));
        }
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
      .set('Cache-Control', 'no-cache');

    return this.http
      .get<Post>(`${this.baseUrl}/post/following-posts-with-likes`, {
        observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
      }).pipe(
        tap(response => {
          const paginationHeader = response.headers.get('Pagination');
          this.paginatedFollowResult.set({
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
