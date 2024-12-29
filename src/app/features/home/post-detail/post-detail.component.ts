import { Component, ElementRef, HostListener, OnInit, signal } from '@angular/core';
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
  selectedCommentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public authService: AuthService,
    private commentService: CommentService
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
      this.loadComments(postId);
      this.checkIfLiked(postId);
    });
  }

  private loadComments(postId: string): void {
    this.commentService.getComments(postId, 0, 100).subscribe(
      (commentsDisplay: CommentDisplay[]) => this.processComments(commentsDisplay),
      (error) => console.error('Error fetching comments:', error)
    );
  }

  private processComments(commentsDisplay: CommentDisplay[]): void {
    const processedComments = commentsDisplay.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt)
    }));
    this.comments.set(processedComments);
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

  createNewComment(form: any): void {
    if (form.valid && this.post) {
      const comment: Comment = {
        postId: this.post.id,
        content: form.value.content,
        authorId: this.authService.currentUser()?.user.id || ''
      };

      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          const newComment = this.createCommentDisplay(response.id || 'default-id', comment);
          // Оновлюємо сигнал коментарів
          this.comments.update(comments => [...comments, newComment]);
          form.reset(); // Очищення форми після успішного додавання
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

  private createCommentDisplay(id: string, comment: Comment): CommentDisplay {
    return {
      id,
      ...comment,
      authorName: this.authService.currentUser()?.user.username || 'Unknown',
      createdAt: new Date(),
      profilePictureUrl: this.authService.currentUser()?.user.profilePictureUrl
    };
  }

  getSortedComments(): CommentDisplay[] {
    return [...this.comments()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  toggleMenu(commentId: string): void {
    this.selectedCommentId = this.selectedCommentId === commentId ? null : commentId;
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        // Оновлюємо список коментарів після видалення
        this.comments.update(comments => comments.filter(comment => comment.id !== commentId));
        console.log('Comment deleted successfully');
        // Закриваємо меню після видалення
        this.selectedCommentId = null;
      },
      error: (err) => console.error('Error deleting comment:', err)
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Перевірка, чи клік відбувся поза межами елемента меню
    const clickedOutsideMenu = event.target instanceof HTMLElement &&
      !event.target.closest('.comment-holder');

    if (clickedOutsideMenu) {
      this.selectedCommentId = null; // Закриваємо меню
    }
  }

}
