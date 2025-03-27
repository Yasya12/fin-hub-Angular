import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Post } from '../../core/models/interfaces/post/post.interface';
import { SinglePost } from '../../features/post-detail/models/single_post.model';
import { PostResponse } from '../../core/models/interfaces/post/post_response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts(pageNumber: number, pageSize: number): Observable<Post[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<PostResponse>(`${this.baseUrl}/post`, { params })
      .pipe(map((response) => response.items));
  }

  getPostsWithLikes(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<Post[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<PostResponse>(`${this.baseUrl}/post/with-likes`, { params })
      .pipe(map((response) => response.items));
  }

  getPostById(id: string): Observable<SinglePost> {
    return this.http.get<SinglePost>(`${this.baseUrl}/post/${id}`);
  }
}
