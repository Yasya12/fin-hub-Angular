import { Component, OnInit } from '@angular/core';
import { Post } from '../../../../core/models/Post/post.model';
import { PostService } from "../../../../core/services/post.service";
import { AuthService } from "../../../signup/services/auth.service";
import { LikeService } from '../../../../core/services/like.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private likeService: LikeService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    const userId = this.authService.currentUser()?.user.id;

    if (userId) {
      this.postService.getPostsWithLikes(userId).subscribe(
        (data) => {
          this.posts = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    } else {
      this.postService.getPosts().subscribe(
        (data) => {
          this.posts = data;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    }
  }

  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      const updatedPost = { ...post };
  
      updatedPost.isLiked = !post.isLiked;
      updatedPost.likesCount += updatedPost.isLiked ? 1 : -1;
  
      this.posts = this.posts.map(p => p.id === post.id ? updatedPost : p);
    });
  }
  
}
