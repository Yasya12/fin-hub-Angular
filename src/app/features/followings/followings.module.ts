import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowingsRoutingModule } from './followings-routing.module';
import { FollowingListComponent } from './following-list/following-list.component';
import { FollowFollowingsComponent } from './follow-followings/follow-followings.component';
import { FollowPostsComponent } from './follow-posts/follow-posts.component';
import { HomeModule } from '../home/home.module';
import { FormattedDatePipe } from '../../shared/pipes/FormattedDatePipe';



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
    FormattedDatePipe
  ]
})
export class FollowingsModule { }
