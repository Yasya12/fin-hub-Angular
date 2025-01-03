import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './posts/posts.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { NgOptimizedImage } from '@angular/common';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from './post-detail/comments/comment/comment.component';
import { CommentFormComponent } from './post-detail/comments/comment-form/comment-form.component';
import { CommentListComponent } from './post-detail/comments/comment-list/comment-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostsComponent,
    HeroSectionComponent,
    PostDetailComponent,
    CommentComponent,
    CommentListComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule { }
