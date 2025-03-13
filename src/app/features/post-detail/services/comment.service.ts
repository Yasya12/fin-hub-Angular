import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Comment} from "../../../core/models/Comment/comment.model";
import { Observable } from 'rxjs';
import { CommentDisplay } from '../../../core/models/Comment/commentDisplay.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  addComment(comment: Comment) : Observable<Comment> {
    return this.http.post<Comment>("http://localhost:8080/api/Comment", comment)
  }

  deleteComment(commentId: string) {
    return this.http.delete(`http://localhost:8080/api/Comment/${commentId}`);
  }  

  getComments(postId: string): Observable<CommentDisplay[]> {
    const params = new HttpParams()
      .set('postId', postId);
      
    return this.http.get<CommentDisplay[]>(`http://localhost:8080/api/Comment`, { params });
  }
}
