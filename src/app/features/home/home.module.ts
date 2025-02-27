import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './ui/posts/posts.component';
import { HeroSectionComponent } from './ui/hero-section/hero-section.component';
import { NgOptimizedImage } from '@angular/common';
import { CreatePostComponent } from './ui/create-post/create-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PostEditorComponent } from './ui/post-editor/post-editor.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostsComponent,
    HeroSectionComponent,
    CreatePostComponent,
    PostEditorComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  exports: [PostEditorComponent] 
})
export class HomeModule { }
