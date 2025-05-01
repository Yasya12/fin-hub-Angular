import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDisplay } from '../models/interfaces/comment-display.interface';
import { CreateCommentDto } from '../models/interfaces/create-comment-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  // Services
  private readonly http = inject(HttpClient);

  addComment(comment: CreateCommentDto): Observable<CommentDisplay> {
    return this.http.post<CommentDisplay>("http://localhost:8080/api/Comment", comment)
  }

  deleteComment(commentId: string) {
    return this.http.delete(`http://localhost:8080/api/Comment/${commentId}`);
  }

  getComments(postId: string, pageNumber: number, pageSize: number, filter: string): Observable<CommentDisplay[]> {
    const params = new HttpParams()
      .set('postId', postId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('filter', filter);

    return this.http.get<CommentDisplay[]>(`http://localhost:8080/api/Comment`, { params });
  }
}
