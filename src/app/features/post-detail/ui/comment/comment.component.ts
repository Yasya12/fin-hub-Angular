import { Component, EventEmitter, HostListener, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentDisplay } from '../../models/interfaces/comment-display.interface';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { CreateCommentDto } from '../../models/interfaces/create-comment-dto.interface';
import { User } from '../../../../core/models/interfaces/user/user.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent implements OnChanges  {
  // Inputs
  comment = input<CommentDisplay>();
  postId = input<string>();
  level = input<number>(0);
  @Input() selectedCommentId: string | null = null;
  currentUser = input<User | undefined>(undefined);
  isAuthorValue = false;

  // States
  isReplying: boolean = false;
  readonly MAX_LEVEL = 5;

  @Output() deleteComment = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<CreateCommentDto>();
  @Output() toggleMenu = new EventEmitter<string | null>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment'] || changes['currentUser']) {
      this.isAuthorValue =
      this.currentUser()?.username === this.comment()?.authorName;
    }
  }

  replyToComment(): void {
    this.isReplying = true;
  }

  cancelReply(): void {
    this.isReplying = false;
  }

  submitReply(reply: CreateCommentDto): void {
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
