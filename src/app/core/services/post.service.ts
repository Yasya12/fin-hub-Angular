import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
