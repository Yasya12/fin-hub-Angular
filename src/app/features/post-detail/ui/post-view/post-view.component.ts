import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { SinglePost } from '../../../../core/models/Post/single_post.model';
import { PostService } from '../../../../core/services/post.service';
import { AuthService } from '../../../signup/services/auth.service';
import { LikeService } from '../../../../core/services/like.service';
import { marked } from 'marked';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent {
  @Input() postId!: string;
  @Input() commentCount: number = 0;
  post: SinglePost | null = null;
  isLiked = false;
  selectedCommentId: string | null = null;

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private likeService: LikeService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    this.loadPost(this.postId);
  }

  private loadPost(postId: string): void {
    this.postService.getPostById(postId).subscribe((data) => {
      this.post = {
        ...data,
        content: marked.parse(data.content) as string
      };
      this.checkIfLiked(postId); this.makeLinksClickable();
    });
  }

  private checkIfLiked(postId: string): void {
    const token = this.authService.currentUser()?.token;
    if (token) {
      this.likeService.isPostLiked(postId).subscribe((response: any) => {
        this.isLiked = response.isLiked;
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
    if (this.post?.id) {
      this.likeService.toggleLike(this.post.id).subscribe((response: any) => {
        this.isLiked = response.success;
        if (this.post) {
          this.post.likesCount += this.isLiked ? 1 : -1;
        }
      });
    }
  }
}
