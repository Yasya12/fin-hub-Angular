import { Component, ElementRef, EventEmitter, HostListener, input, Input, Output, signal } from '@angular/core';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { CreateCommentDto } from '../../models/interfaces/create-comment-dto.interface';
import { User } from '../../../../core/models/interfaces/user/user.interface';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  @Input() postId!: string;
  @Input() parentId: string | undefined;
  @Input() isReply: boolean = false;
   currentUser = input<User | undefined>(undefined);
  @Output() addComment = new EventEmitter<CreateCommentDto>();
  @Output() isRepling = new EventEmitter<boolean>();

  
  isReplyFormOpen: boolean = false;
  content: string = '';

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.isReplyFormOpen = this.isReply;
  }

  onSubmit(): void {
    if (this.content.trim()) {
      const commentPayload: CreateCommentDto = {
        postId: this.postId,
        content: this.content.trim(),
        parentId: this.parentId,
      };

      this.addComment.emit(commentPayload);
      this.content = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isReplyFormOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isReplyFormOpen = false;
      this.isRepling.emit(false);
    }
  }
}
