import { Component, inject } from '@angular/core';
import { CreateCommentDto } from './models/interfaces/create-comment-dto.interface';
import { PostDetailStore } from './stores/post-detail/post-detail.store';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostDetailStore]
})
export class PostDetailComponent {
  postDetailStore = inject(PostDetailStore);

  currentUserId: string | undefined = this.postDetailStore.getCurrentUserId();

  handleAddCommentRequest(commentPayload: CreateCommentDto) {
    if (!this.currentUserId) {
      this.postDetailStore.displayCreateCommentAuthWarning();
      return;
    }

    commentPayload.authorId = this.currentUserId

    this.postDetailStore.addCommentToPost(commentPayload);
  }
}
