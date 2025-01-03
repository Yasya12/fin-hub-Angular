import { Component, HostListener, Input, signal } from '@angular/core';
import { CommentService } from '../../../../../core/services/comment.service';
import { CommentDisplay } from '../../../../../core/models/Comment/commentDisplay.model';
import { Comment } from '../../../../../core/models/Comment/comment.model';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html'
})
export class CommentListComponent {
  @Input() postId!: string;
  comments = signal<CommentDisplay[]>([]);
  selectedCommentId: string | null = null;

  constructor(private commentService: CommentService, private authService: AuthService) {}

  ngOnInit() {
    this.loadComments();
  }

  private loadComments(): void {
    this.commentService.getComments(this.postId, 0, 100).subscribe(
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

  getSortedComments(): CommentDisplay[] {
    return [...this.comments()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  onAddComment(newComment: Comment): void {
    newComment.authorId = this.authService.currentUser()?.user.id || 'Unknown',
    this.commentService.addComment(newComment).subscribe({
      next: (response) => {
        const newCommentDisplay = this.createCommentDisplay(response.id || 'default-id', newComment);
        this.comments.update(comments => [...comments, newCommentDisplay]); 
      },
      error: (err) => console.error('Error adding comment:', err)
    });
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

  toggleMenu(commentId: string): void {
    this.selectedCommentId = this.selectedCommentId === commentId ? null : commentId;
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

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(comments => comments.filter(comment => comment.id !== commentId));
        this.selectedCommentId = null;
      },
      error: (err) => console.error('Error deleting comment:', err)
    });
  }
}
