import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { AuthService } from '../signup/services/auth.service';
import { ResponseModel } from '../signup/models/response.model';
import { Post } from '../../core/models/Post/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  curretnUserEmail: string | null = null;
  curretnUser: ResponseModel | null = null;
  newPost = signal<Post | undefined>(undefined);

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.curretnUserEmail = this.authService.currentUser()?.user.email ?? null;
    this.curretnUser = this.authService.currentUser();
  }

  addPost(post: Post): void {
    this.newPost.set(post);
  }
}