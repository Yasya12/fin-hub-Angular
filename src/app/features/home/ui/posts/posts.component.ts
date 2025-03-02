import { Component, effect, Input, OnInit, Signal, signal } from '@angular/core';
import { Post } from '../../../../core/models/Post/post.model';
import { PostService } from "../../../../core/services/post.service";
import { AuthService } from "../../../signup/services/auth.service";
import { LikeService } from '../../../../core/services/like.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal<boolean>(true);
  @Input() newPost!: Signal<Post | null>;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private likeService: LikeService,
    private router: Router
  ) {
    effect(() => {
      const post = this.newPost();
      if (post) {
        this.posts.update(posts => [post, ...posts]);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    this.loading.set(true);

    const userId = this.authService.currentUser()?.user.id;
    const postObservable = userId
      ? this.postService.getPostsWithLikes(userId)
      : this.postService.getPosts();

    postObservable.subscribe({
      next: async (data) => {
        this.posts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }

  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      this.posts.update(posts =>
        posts.map(p =>
          p.id === post.id
            ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
            : p
        )
      );
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
