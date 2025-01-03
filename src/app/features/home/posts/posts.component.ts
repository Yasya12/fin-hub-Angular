import { Component, OnInit } from '@angular/core';
import { Post } from '../../../core/models/Post/post.model';
import { PostService } from "../../../core/services/post.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data; 
        this.loading = false;

        const token = this.authService.currentUser()?.token;
        if (token) {
          this.posts.forEach(post => this.checkIfLiked(post));
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  checkIfLiked(post: Post): void {
    this.postService.isPostLiked(post.id).subscribe((response: any) => {
      post.isLiked = response.isLiked;
    });
  }

  toggleLike(post: Post): void {
    this.postService.toggleLike(post.id).subscribe((response: any) => {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    });
  }
}
