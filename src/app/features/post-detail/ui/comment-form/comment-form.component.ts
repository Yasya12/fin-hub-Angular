import { Component, ElementRef, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { Comment } from '../../../../core/models/Comment/comment.model';
import { ResponseModel } from '../../../signup/models/response.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  @Input() postId!: string;
  @Input() parentId: string | null = null;
  @Input() isReply: boolean = false;
  @Input() currentUser = signal<ResponseModel | undefined>(undefined);
  @Output() addComment = new EventEmitter<Comment>();
  @Output() isRepling = new EventEmitter<boolean>();

  isReplyFormOpen: boolean = false;
  content: string = '';

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.isReplyFormOpen = this.isReply;
  }

  onSubmit(): void {
    if (this.content.trim()) {
      const comment: Comment = {
        postId: this.postId,
        content: this.content.trim(),
        parentId: this.parentId,
        authorId: ''
      };

      this.addComment.emit(comment);
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
