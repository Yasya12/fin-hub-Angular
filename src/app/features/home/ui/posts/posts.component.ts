import { Component, OnInit } from '@angular/core';
import { Post } from '../../../../core/models/Post/post.model';
import { PostService } from "../../../../core/services/post.service";
import { AuthService } from "../../../../core/services/auth.service";
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
          console.log(this.posts);
        },
        (error) => {
          this.loading = false;
          //console.error('Error loading posts with likes:', error);
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
          //console.error('Error loading posts:', error);
        }
      );
    }
  }

  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      // Копіюємо пост у новий об'єкт
      const updatedPost = { ...post };
  
      // Оновлюємо властивості нового об'єкта
      updatedPost.isLiked = !post.isLiked;
      updatedPost.likesCount += updatedPost.isLiked ? 1 : -1;
  
      // Замінюємо старий пост у масиві на оновлений
      this.posts = this.posts.map(p => p.id === post.id ? updatedPost : p);
    });
  }
  
}
