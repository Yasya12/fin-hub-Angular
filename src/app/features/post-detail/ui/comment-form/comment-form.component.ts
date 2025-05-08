import { Component, ElementRef, EventEmitter, HostListener, inject, input, Input, Output } from '@angular/core';
import { CreateCommentDto } from '../../models/interfaces/create-comment-dto.interface';
import { User } from '../../../../core/models/interfaces/user/user.interface';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  //Services
  private elementRef = inject(ElementRef);

  //Inputs
  currentUser = input<User | undefined>(undefined);
  @Input() postId!: string;
  @Input() parentId: string | undefined;
  @Input() isReply: boolean = false;

  //Outputs
  @Output() addComment = new EventEmitter<CreateCommentDto>();
  @Output() isRepling = new EventEmitter<boolean>();

  //States
  isReplyFormOpen: boolean = false;
  content: string = '';

  //hooks
  ngOnInit() {
    this.isReplyFormOpen = this.isReply;
  }

  //methods
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
