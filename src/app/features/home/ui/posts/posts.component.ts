import { Component, OnInit } from '@angular/core';
import { Post } from '../../../../core/models/Post/post.model';
import { PostService } from "../../../../core/services/post.service";
import { AuthService } from "../../../signup/services/auth.service";
import { LikeService } from '../../../../core/services/like.service';
import { Router } from '@angular/router';
import { marked } from 'marked'; 


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
    private likeService: LikeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    this.loading = true;
    const userId = this.authService.currentUser()?.user.id;
  
    const postObservable = userId
      ? this.postService.getPostsWithLikes(userId)
      : this.postService.getPosts();
  
    postObservable.subscribe(async (data) => {
      // Convert Markdown to HTML asynchronously
      const parsedPosts = await Promise.all(
        data.map(async (post) => ({
          ...post,
          content: await marked.parse(post.content) // Ensure `content` is fully resolved
        }))
      );
  
      this.posts = parsedPosts; // Now posts have proper `string` content
      this.loading = false;
    }, 
    (error) => {
      this.loading = false;
    });
  }
  
  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      const updatedPost = { ...post };
  
      updatedPost.isLiked = !post.isLiked;
      updatedPost.likesCount += updatedPost.isLiked ? 1 : -1;
  
      this.posts = this.posts.map(p => p.id === post.id ? updatedPost : p);
    });
  }

  navigateToPost(postId: string) {
    this.router.navigateByUrl(`/home/post/${postId}`);
  }
  
  handleLinkClick(event: Event, postId: string) {
    event.preventDefault(); // Блокуємо відкриття посилання
    event.stopPropagation(); // Зупиняємо подальше розповсюдження кліку
    this.navigateToPost(postId);
  }
  
}
