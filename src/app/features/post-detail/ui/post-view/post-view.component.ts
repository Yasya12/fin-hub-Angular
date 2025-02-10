import { Component, Input } from '@angular/core';
import { SinglePost } from '../../../../core/models/Post/single_post.model';
import { PostService } from '../../../../core/services/post.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LikeService } from '../../../../core/services/like.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent {
  @Input() postId!: string;
  post: SinglePost | null = null;
  isLiked = false;
  selectedCommentId: string | null = null;

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private likeService: LikeService
  ) { }

  ngOnInit(): void {
    console.log("postid - " + this.postId)
    this.loadPost(this.postId);
  }

  private loadPost(postId: string): void {
    this.postService.getPostById(postId).subscribe((data) => {
      this.post = data;
      this.checkIfLiked(postId);
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
