import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './ui/posts/posts.component';
import { HeroSectionComponent } from './ui/hero-section/hero-section.component';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    PostsComponent,
    HeroSectionComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    HomeRoutingModule
  ]
})
export class HomeModule { }
