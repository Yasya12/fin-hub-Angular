import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { SinglePost } from '../../core/models/Post/single_post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: SinglePost | null = null;
  isLiked = false;
  selectedCommentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    }
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
      this.postService.isPostLiked(postId).subscribe((response: any) => {
        this.isLiked = response.isLiked;
      });
    }
  }

  toggleLike(): void {
    if (this.post?.id) {
      this.postService.toggleLike(this.post.id).subscribe((response: any) => {
        this.isLiked = response.success;
        if (this.post) {
          this.post.likesCount += this.isLiked ? 1 : -1;
        }
      });
    }
  }
}
