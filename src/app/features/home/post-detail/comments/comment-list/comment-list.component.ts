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
  selectedCommentId: string | null = null;

  constructor(private authService: AuthService, private commentService: CommentService) { }

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

    const tree = this.buildCommentTree(processedComments);
    this.comments.set(tree);
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

  addReply(newReply: Comment): void {
    newReply.authorId = this.authService.currentUser()?.user.id || '';
    this.commentService.addComment(newReply).subscribe({
      next: (response: Comment) => {
        const transformedResponse = this.mapToCommentDisplay(response);
  
        // Знайти батьківський коментар
        if (transformedResponse.parentId) {
          const parent = this.findCommentById(transformedResponse.parentId);
          if (parent) {
            parent.children = [...(parent.children || []), transformedResponse]; // Оновлюємо children
          }
          this.loadComments();
        }
      },
      error: (err) => console.error('Error adding reply:', err),
    });
  }
  
  private findCommentById(id: string): CommentDisplay | undefined {
    const stack = [...this.comments()];
    while (stack.length) {
      const current = stack.pop();
      if (current?.id === id) return current;
      if (current?.children?.length) stack.push(...current.children);
    }
    return undefined;
  }
  

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => { 
        this.loadComments()
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

  private buildCommentTree(comments: CommentDisplay[]): CommentDisplay[] {
    const map = new Map<string, CommentDisplay>();

    comments.forEach(comment => {
      comment.children = [];
      map.set(comment.id, comment);
    });

    const rootComments: CommentDisplay[] = [];

    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.children?.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  onChildToggleMenu(newSelectedId: string | null): void {
    this.selectedCommentId = newSelectedId; // Оновлюємо стан меню
  }
  
  
}
