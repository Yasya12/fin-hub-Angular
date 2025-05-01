import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommentDisplay } from '../../models/interfaces/comment-display.interface';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { CreateCommentDto } from '../../models/interfaces/create-comment-dto.interface';
import { PostDetailStore } from '../../stores/post-detail/post-detail.store';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
})

export class CommentListComponent implements OnInit {
  // Services
  protected readonly postDetailsStore = inject(PostDetailStore);
  private readonly scrollService = inject(ScrollService);

  // Inputs
  postId = input.required<string>();

  //Outputs
  addCommentRequest = output<CreateCommentDto>();

  // States
  selectedCommentId: string | null = null;
  lastScrollTop: number = 0;

  // Lifecycle hooks
  ngOnInit(): void {
    this.postDetailsStore.getComments(this.postId());

    this.scrollService.scrollContainer$.subscribe(container => {
      if (container) {
        container.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }
  
  updateComments(filtered: CommentDisplay[]): void {
    // this.comments.set(filtered);
  }

  handleAddCommentRequest(commentPayload: CreateCommentDto): void {
    this.addCommentRequest.emit(commentPayload)
  }

  onChildToggleMenu(newSelectedId: string | null): void {
    this.selectedCommentId = newSelectedId;
  }

  // Event handlers
  onScroll(event: Event): void {
    if (!this.postDetailsStore.hasMoreComments()) return;
    const container = (event.target as HTMLElement);
    if (container.scrollTop + container.clientHeight >= container.scrollHeight * 0.9) {

      this.postDetailsStore.increasePageNumberForComments();
      this.postDetailsStore.getComments(this.postId());
    }
  }
}