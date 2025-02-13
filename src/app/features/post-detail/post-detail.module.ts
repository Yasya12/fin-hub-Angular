import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './ui/comment/comment.component';
import { CommentListComponent } from './ui/comment-list/comment-list.component';
import { CommentFormComponent } from './ui/comment-form/comment-form.component';
import { PostDetailComponent } from './post-detail.component';
import { FormsModule } from '@angular/forms';
import { PostViewComponent } from './ui/post-view/post-view.component';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';

@NgModule({
  declarations: [
    PostDetailComponent,
    CommentComponent,
    CommentListComponent,
    CommentFormComponent,
    PostViewComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PostDetailModule { }
