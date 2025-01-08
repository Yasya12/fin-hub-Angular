import { Component, Input, signal, computed } from '@angular/core';
import { Comment } from '../../../../../core/models/Comment/comment.model';
import { CommentDisplay } from '../../../../../core/models/Comment/commentDisplay.model';
import { CommentService } from '../../../../../core/services/comment.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
})
export class CommentListComponent {
  @Input() postId!: string;

  comments = signal<CommentDisplay[]>([]);

  constructor(private authService: AuthService, private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  private loadComments(): void {
    this.commentService.getComments(this.postId, 0, 100).subscribe( //тут чекнути як реалізуватипагінацію на сайті а не хардкодити
      (commentsDisplay: CommentDisplay[]) => this.processComments(commentsDisplay),
      (error) => console.error('Error fetching comments:', error)
    );
  }

  private processComments(commentsDisplay: CommentDisplay[]): void {
    const processedComments = commentsDisplay.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt)
    }));
    this.comments.set(processedComments);
  }

  getSortedComments(): CommentDisplay[] {
    return [...this.comments()]
    .filter(comment => comment.parentId === null)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getReplies(parentId: string): CommentDisplay[] {
    return this.comments().filter(comment => comment.parentId === parentId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addComment(newComment: Comment): void {
    newComment.authorId = this.authService.currentUser()?.user.id || '';
    this.commentService.addComment(newComment).subscribe({
      next: (response: Comment) => {
        const transformedResponse = this.mapToCommentDisplay(response);
        this.comments.update((currentComments) =>  [...currentComments, transformedResponse]);
      },
      error: (err) => console.error('Error adding comment:', err),
    });
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update((currentComments) =>
          currentComments.filter(comment => comment.id !== commentId)
        ); 
      },
      error: (err) => console.error('Error deleting comment:', err),
    });
  }

  private mapToCommentDisplay(comment: Comment): CommentDisplay {
    const transformed = {
      id: comment.id || '',
      content: comment.content,
      authorName: this.authService.currentUser()?.user.username || 'Anonymous',
      createdAt: new Date(),
      profilePictureUrl: this.authService.currentUser()?.user.profilePictureUrl,
      parentId: comment.parentId,
    };
    return transformed;
  }
}
