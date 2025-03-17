import { Component, signal, Output, EventEmitter, inject, input, OnInit } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { CommentDisplay } from '../../models/commentDisplay.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ResponseModel } from '../../../signup/models/response.model';
import { ScrollService } from '../../../../shared/services/scroll.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
})
export class CommentListComponent implements OnInit {
  // Services
  private readonly authService = inject(AuthService);
  private readonly commentService = inject(CommentService);
  private readonly scrollService = inject(ScrollService);

  // Inputs
  postId = input<string>();

  // States
  currentUser = signal<ResponseModel | undefined>(undefined);
  comments = signal<CommentDisplay[]>([]);
  selectedCommentId: string | null = null;
  pageNumber = 1;
  pageSize = 10;
  hasMoreComments = true;
  lastScrollTop: number = 0;

  @Output() commentsUpdated = new EventEmitter<number>();

   // Lifecycle hooks
   ngOnInit(): void {
    this.currentUser.set(this.authService.currentUser());
    this.loadComments();
    this.scrollService.scrollContainer$.subscribe(container => {
      if (container) {
        container.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }

  //Methods
  private loadComments(): void {
    this.commentService.getComments(this.postId()!, this.pageNumber, this.pageSize).subscribe(
      (items) => {
        if (items.length < this.pageSize) {
          this.hasMoreComments = false;
        }
        const processedComments = this.processComments(items);
        this.getSortedComments();
        this.comments.set([...this.comments(), ...processedComments]);
        this.pageNumber++;
      },
      (error) => console.error('Error fetching comments:', error)
    );
  }

  processComments = (comments: CommentDisplay[]): CommentDisplay[] => {
    return comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      replies: comment.replies ? this.processComments(comment.replies) : [] // Process replies recursively
    }));
  };

  getSortedComments(): CommentDisplay[] {
    return [...this.comments()]
      .filter(comment => comment.parentId === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  updateComments(filtered: CommentDisplay[]): void {
    this.comments.set(filtered);
  }

  addComment(newComment: Comment): void {
    newComment.authorId = this.currentUser()?.user.id || '';

    this.commentService.addComment(newComment).subscribe({
      next: (response: Comment) => {
        const transformedResponse = this.mapToCommentDisplay(response);
        this.comments.set([...this.comments(), transformedResponse]);
        this.comments.set(this.getSortedComments());
        this.commentsUpdated.emit();
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
            parent.replies = [...(parent.replies || []), transformedResponse];
            this.comments.update(existingComments => [...existingComments]);
          }
        } else {
          this.comments.update(existingComments => [...existingComments, transformedResponse]);
        }

        this.commentsUpdated.emit(this.comments().length);
      },
      error: (err) => console.error('Error adding reply:', err),
    });
  }

  private findCommentById(id: string): CommentDisplay | undefined {
    const stack = [...this.comments()];
    while (stack.length) {
      const current = stack.pop();
      if (current?.id === id) return current;
      if (current?.replies?.length) stack.push(...current.replies);
    }
    return undefined;
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(comments => this.removeCommentFromTree(comments, commentId));
      },
      error: (err) => console.error('Error deleting comment:', err),
    });
  }

  private removeCommentFromTree(comments: CommentDisplay[], commentId: string): CommentDisplay[] {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
      }));
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

  onChildToggleMenu(newSelectedId: string | null): void {
    this.selectedCommentId = newSelectedId;
  }
  
  isNewComment(comment: CommentDisplay): boolean {
    const now = new Date();
    const commentDate = new Date(comment.createdAt);
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / 60000;
    return diffInMinutes <= 1;
  }

  // Event handlers
  onScroll(event: Event): void {
    if (!this.hasMoreComments) return;
    const container = (event.target as HTMLElement);
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - container.scrollHeight * 0.1) {
      this.loadComments();
    }
  }
}