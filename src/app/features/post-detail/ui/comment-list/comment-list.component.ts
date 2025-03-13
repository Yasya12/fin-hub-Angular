import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../../core/models/Comment/comment.model';
import { CommentDisplay } from '../../../../core/models/Comment/commentDisplay.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ResponseModel } from '../../../signup/models/response.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
})
export class CommentListComponent {
  @Input() postId!: string;
  @Output() commentsUpdated = new EventEmitter<number>();

  currentUser = signal<ResponseModel | undefined>(undefined);

  allComments = signal<CommentDisplay[]>([]);
  comments = signal<CommentDisplay[]>([]);

  selectedCommentId: string | null = null;

  currentPage: number = 0;
  pageSize: number = 3;
  hasMoreComments: boolean = true;


  constructor(private authService: AuthService, private commentService: CommentService) {
    this.currentUser.set(this.authService.currentUser());
  }

  ngOnInit(): void {
    this.loadComments();
  }

  private loadComments(): void {
    this.commentService.getComments(this.postId).subscribe(
      (commentsDisplay: CommentDisplay[]) => {
        this.processComments(commentsDisplay);
        this.comments.set(this.getSortedComments());
        this.updatePaginatedComments();
        setTimeout(() => {
          this.commentsUpdated.emit(this.comments().length);
        });
      },
      (error) => console.error('Error fetching comments:', error)
    );
  }

  updatePaginatedComments(): void {
    const sorted = this.getSortedComments();
    this.allComments.set(this.comments().slice(0, this.pageSize));
    this.hasMoreComments = sorted.length > this.pageSize;
  }

  loadMoreComments(): void {
    this.pageSize += 3;
    this.updatePaginatedComments();
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

  updateComments(filtered: CommentDisplay[]): void {
    this.comments.set(filtered);
    this.allComments.set(filtered.slice(0, this.pageSize)); // Оновлюємо відображені коментарі
    this.hasMoreComments = filtered.length > this.pageSize;
  }


  getReplies(parentId: string): CommentDisplay[] {
    return this.comments().filter(comment => comment.parentId === parentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addComment(newComment: Comment): void {
    newComment.authorId = this.currentUser()?.user.id || '';
    this.commentService.addComment(newComment).subscribe({
      next: (response: Comment) => {
        const transformedResponse = this.mapToCommentDisplay(response);

        this.comments.set([...this.comments(), transformedResponse]);
        this.comments.set(this.getSortedComments());
        this.commentsUpdated.emit(this.comments().length);

        this.allComments.set(this.comments().slice(0, this.pageSize));
      },
      error: (err) => console.error('Error adding comment:', err),
    });
  }

  addReply(newReply: Comment): void {
    newReply.authorId = this.currentUser()?.user.id || '';
    this.commentService.addComment(newReply).subscribe({
      next: (response: Comment) => {
        const transformedResponse = this.mapToCommentDisplay(response);

        if (transformedResponse.parentId) {
          const parent = this.findCommentById(transformedResponse.parentId);
          if (parent) {
            parent.children = [...(parent.children || []), transformedResponse];
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
        this.loadComments();
      },
      error: (err) => console.error('Error deleting comment:', err),
    });
  }

  private mapToCommentDisplay(comment: Comment): CommentDisplay {
    const transformed = {
      id: comment.id || '',
      content: comment.content,
      authorName: this.currentUser()?.user.username || 'Anonymous',
      createdAt: new Date(),
      profilePictureUrl: this.currentUser()?.user.profilePictureUrl,
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
    this.selectedCommentId = newSelectedId;
  }

  isNewComment(comment: CommentDisplay): boolean {
    const now = new Date();
    const commentDate = new Date(comment.createdAt);
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / 60000;
    return diffInMinutes <= 1; // Вважаємо комент новим, якщо йому менше 5 хвилин
  }


}
