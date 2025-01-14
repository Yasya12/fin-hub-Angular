import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './ui/comment/comment.component';
import { CommentListComponent } from './ui/comment-list/comment-list.component';
import { CommentFormComponent } from './ui/comment-form/comment-form.component';
import { PostDetailComponent } from './post-detail.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PostDetailComponent,
    CommentComponent,
    CommentListComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PostDetailModule { }
