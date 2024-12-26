import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Comment} from "../models/comment.model";

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  addComment(comment: Comment){
    return this.http.post("http://localhost:8080/api/Comment", comment)
  }
}
