import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Comment } from '../../../../../core/models/Comment/comment.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  @Input() postId!: string;
  @Output() addComment = new EventEmitter<Comment>();

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const comment: Comment = {
        postId: this.postId,
        content: form.value.content,
        authorId: '' 
      };
      this.addComment.emit(comment);
      form.reset();
    }
  }
}
