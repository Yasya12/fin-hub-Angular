import { Component, effect, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { SinglePost } from '../../models/single_post.model';
import { PostService } from '../../../../shared/services/post.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LikeService } from '../../../../shared/services/like.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent {
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  // Inputs
  postId = input<string>();
  commentCount = input<number>(0);

  // States
  isLiked = signal<boolean>(false);
  post: SinglePost | null = null;
  selectedCommentId: string | null = null;


  myEffect = effect(() => {
    this.commentCount();
    if (this.post)
      this.post!.commentCount += 1;
  });


  private loadPost(postId: string): void {
    this.postService.getPostById(postId).subscribe((data) => {
      this.post = {
        ...data
      };
      this.checkIfLiked(postId);
      this.makeLinksClickable();
    });
  }

  private checkIfLiked(postId: string): void {
    const token = this.authService.currentUser()?.token;
    if (token) {
      this.likeService.isPostLiked(postId).subscribe((response: any) => {
        this.isLiked.set(response);
      });
    }
  }

  private makeLinksClickable() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.querySelectorAll('a').forEach((link) => {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });
      }, 1);
    }
  }

  toggleLike(): void {
    if (!this.post?.id) return;
    this.likeService.toggleLike(this.post.id).subscribe((response: any) => {
      this.isLiked.set(response);
      this.post!.likesCount += this.isLiked() ? 1 : -1;
    });
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadPost(this.postId()!);
  }
}
