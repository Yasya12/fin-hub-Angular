import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowingsRoutingModule } from './followings-routing.module';
import { FollowingListComponent } from './following-list/following-list.component';
import { FollowFollowingsComponent } from './following-list/follow-followings/follow-followings.component';
import { FollowPostsComponent } from './following-list/follow-posts/follow-posts.component';
import { HomeModule } from '../home/home.module';
import { FormattedDatePipe } from '../../shared/pipes/FormattedDatePipe';
import { NewsComponent } from '../../shared/ui/news/news.component';



@NgModule({
  declarations: [
    FollowingListComponent,
    FollowFollowingsComponent,
    FollowPostsComponent
  ],
  imports: [
    CommonModule,
    FollowingsRoutingModule,
    HomeModule,
    FormattedDatePipe,
    NewsComponent
  ]
})
export class FollowingsModule { }
