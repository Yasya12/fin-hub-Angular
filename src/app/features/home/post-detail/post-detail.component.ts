import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../../core/services/comment.service';
import { Comment } from '../../../core/models/Comment/comment.model';
import { SinglePost } from '../../../core/models/single_post.model';
import { CommentDisplay } from '../../../core/models/Comment/commentDisplay.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: SinglePost | null = null;
  isLiked = false;
  comments = signal<CommentDisplay[]>([]);

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    }
  }

  private loadPost(postId: string): void {
    this.postService.getPostById(postId).subscribe((data) => {
      this.post = data;
      if (this.post && this.post.createdAt) {
        this.post.createdAt = new Date(this.post.createdAt);
      }
      this.setComments(data.comments);
      const token = this.authService.currentUser()?.token;
      if (token) {
        this.checkIfLiked(postId);
      }
    });
  }

  private setComments(commentsData: any[]): void {
    const commentsDisplay: CommentDisplay[] = commentsData.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt)
    }));
    this.comments.set(commentsDisplay);
  }

  checkIfLiked(postId: string): void {
    this.postService.isPostLiked(postId).subscribe((response: any) => {
      this.isLiked = response.isLiked;
    });
  }

  toggleLike(): void {
    if (this.post && this.post.id) {
      this.postService.toggleLike(this.post.id).subscribe((response: any) => {
        this.isLiked = response.success;
        if (this.post) {
          this.post.likesCount += this.isLiked ? 1 : -1;
        }
      });
    }
  }

  createNewComment(form: any): void {
    if (form.valid && this.post) {
      const comment: Comment = {
        postId: this.post.id,
        content: form.value.content,
        authorId: this.authService.currentUser()?.user.id || ''
      };

      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          const newComment: CommentDisplay = {
            ...comment,
            authorName: this.authService.currentUser()?.user.username || 'Unknown',
            createdAt: new Date()
          };
          // Оновлюємо сигнал коментарів
          this.comments.update(comments => [...comments, newComment]);
          form.reset(); // Очищення форми після успішного додавання
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
    }
  }

  getSortedComments(): CommentDisplay[] {
    return this.comments().slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
