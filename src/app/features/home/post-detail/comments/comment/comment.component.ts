import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommentDisplay } from '../../../../../core/models/Comment/commentDisplay.model';
import { Comment } from '../../../../../core/models/Comment/comment.model';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent {
  @Input() comment!: CommentDisplay;
  @Input() replies: CommentDisplay[] = []; 
  @Input() postId!: string;

  @Output() deleteComment = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<Comment>();

  isReplying: boolean = false;
  selectedCommentId: string | null = null; 
  constructor(private authService: AuthService) {}

  isAuthor(): boolean {
    const currentUser = this.authService.currentUser()?.user;
    return currentUser?.username === this.comment.authorName;
  }

  replyToComment(): void {
    this.isReplying = true;
  }

  cancelReply(): void {
    this.isReplying = false;
  }

  submitReply(reply: Comment): void {
    if (reply && reply.content.trim()) {
      reply.authorId = this.authService.currentUser()?.user.id || '',
      this.addReply.emit(reply);
      this.isReplying = false;
    }
  }

  onToggleMenu(): void {
    if (this.selectedCommentId === this.comment.id) {
      this.selectedCommentId = null; // Закрити меню
    } else {
      this.selectedCommentId = this.comment.id; // Відкрити меню
    }
  }

  onDelete(): void {
    this.deleteComment.emit(this.comment.id);
    this.selectedCommentId = null; 
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
