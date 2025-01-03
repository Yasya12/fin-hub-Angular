import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentDisplay } from '../../../../../core/models/Comment/commentDisplay.model';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent {
  @Input() comment!: CommentDisplay; 
  @Input() selectedCommentId!: string | null; 
  
  @Output() toggleMenu = new EventEmitter<string>(); 
  @Output() deleteComment = new EventEmitter<string>(); 

  constructor(private authService: AuthService) {}

  isAuthor(): boolean {
    const currentUser = this.authService.currentUser()?.user;
    return currentUser?.username === this.comment.authorName; // чекнути чи може декілька юзер мати той самий юзернейм
  }

  onToggleMenu(): void {
    this.toggleMenu.emit(this.comment.id);
  }

  onDelete(): void {
    this.deleteComment.emit(this.comment.id);
  }
}
