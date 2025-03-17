import { Component, EventEmitter, HostListener, input, Input, Output } from '@angular/core';
import { CommentDisplay } from '../../models/commentDisplay.model';
import { Comment } from '../../models/comment.model';
import { ResponseModel } from '../../../signup/models/response.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent {
  // Inputs
  comment = input<CommentDisplay>();
  postId = input<string>();
  level = input<number>(0);
  @Input() selectedCommentId: string | null = null;
  currentUser = input<ResponseModel | undefined>(undefined);

  // States
  isReplying: boolean = false;
  readonly MAX_LEVEL = 5;

  @Output() deleteComment = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<Comment>();
  @Output() toggleMenu = new EventEmitter<string | null>();

  isAuthor(): boolean {
    const currentUser = this.currentUser()?.user;
    return currentUser?.username === this.comment()?.authorName;
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

  checkIfRepling(check: boolean): void {
    this.isReplying = check;
  }

  onToggleMenu(): void {
    const newSelectedId = this.selectedCommentId === this.comment()?.id ? null : this.comment()?.id;
    this.toggleMenu.emit(newSelectedId); 
  }

  onDelete(): void {
    this.deleteComment.emit(this.comment()?.id);
    this.selectedCommentId = null; 
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedOutsideMenu = event.target instanceof HTMLElement &&
      !event.target.closest('.comment-holder');
    if (clickedOutsideMenu) {
      this.toggleMenu.emit(null);
    }
  }
}
