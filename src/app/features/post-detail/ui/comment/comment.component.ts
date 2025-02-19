import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommentDisplay } from '../../../../core/models/Comment/commentDisplay.model';
import { Comment } from '../../../../core/models/Comment/comment.model';
import { AuthService } from '../../../signup/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent {
  @Input() comment!: CommentDisplay;
  @Input() postId!: string;
  @Input() level: number = 0; 
  @Input() selectedCommentId: string | null = null;


  @Output() deleteComment = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<Comment>();
  @Output() toggleMenu = new EventEmitter<string | null>();

  isReplying: boolean = false;
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
      this.addReply.emit(reply);
      this.isReplying = false;
    }
  }

  checkIfRepling(check: boolean): void{
    this.isReplying = check;
  }

  onToggleMenu(): void {
    const newSelectedId = this.selectedCommentId === this.comment.id ? null : this.comment.id;
    this.toggleMenu.emit(newSelectedId); // Передаємо новий стан до батьківського компонента
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
      this.toggleMenu.emit(null); // Закриваємо меню
    }
  }
}
