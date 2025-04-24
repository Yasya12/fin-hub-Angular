import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './ui/comment/comment.component';
import { CommentListComponent } from './ui/comment-list/comment-list.component';
import { CommentFormComponent } from './ui/comment-form/comment-form.component';
import { PostDetailComponent } from './post-detail.component';
import { FormsModule } from '@angular/forms';
import { PostViewComponent } from './ui/post-view/post-view.component';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';
import { CommentsFilterComponent } from './ui/comments-filter/comments-filter.component';
import { SideBarComponent } from '../../shared/ui/side-bar/side-bar.component';
import { ChartsViewComponent } from '../../shared/ui/charts-view/charts-view.component';
import { PostDetailStore } from './stores/post-detail/post-detail.store';

@NgModule({
  declarations: [
    PostDetailComponent,
    CommentComponent,
    CommentListComponent,
    CommentFormComponent,
    PostViewComponent,
    CommentsFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TimeAgoPipe,
    SideBarComponent,
    ChartsViewComponent
  ],
})
export class PostDetailModule { }
