import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Post } from "../../core/models/Post/post.model";
import { SinglePost } from "../../features/post-detail/models/single_post.model";
import { PostResponse } from '../../core/models/Post/post_response';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<PostResponse>(`${this.baseUrl}/post`).pipe(
      map((response) => response.items)
    );
  }

  getPostsWithLikes(userId: string, pageNumber: number = 1, pageSize: number = 10): Observable<Post[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PostResponse>(`${this.baseUrl}/post/with-likes`, { params }).pipe(
      map((response) => response.items)
    );
  }

  getPostById(id: string): Observable<SinglePost> {
    return this.http.get<SinglePost>(`${this.baseUrl}/post/${id}`);
  }
}
