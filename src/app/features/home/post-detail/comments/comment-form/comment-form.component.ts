import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../../../../core/models/Comment/comment.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  @Input() postId!: string;
  @Input() parentId: string | null = null;
  @Output() addComment = new EventEmitter<Comment>();

  content: string = ''; // Поле для зберігання тексту коментаря

  onSubmit(): void {
    if (this.content.trim()) {
      const comment: Comment = {
        postId: this.postId,
        content: this.content.trim(),
        parentId: this.parentId,
        authorId: '' // Автор доданий на рівні сервісу
      };

      this.addComment.emit(comment);
      this.content = ''; 
    }
  }
}
