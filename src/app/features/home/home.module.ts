import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './posts/posts.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { NgOptimizedImage } from '@angular/common'

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
