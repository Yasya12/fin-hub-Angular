import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './posts/posts.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { NgOptimizedImage } from '@angular/common';
import { PostDetailComponent } from './post-detail/post-detail.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostsComponent,
    HeroSectionComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    HomeRoutingModule
  ]
})
export class HomeModule { }
