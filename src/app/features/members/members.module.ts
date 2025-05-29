import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersRoutingModule } from './members-routing.module';
import { FormsModule } from '@angular/forms';
import { MemberDetailComponent } from './member-profile/member-detail/member-detail.component';
import { MemberMessagesComponent } from './member-messages/member-messages.component';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { NewsComponent } from '../../shared/ui/news/news.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { PostListComponent } from "../../shared/ui/post-list/post-list.component";
import { FollowersFollowingComponent } from './member-profile/member-detail/followers-following/followers-following.component';



@NgModule({
  declarations: [
    MemberEditComponent,
    MemberDetailComponent,
    MemberMessagesComponent,
    MemberProfileComponent,
    FollowersFollowingComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule,
    TimeAgoPipe,
    NewsComponent,
    PostListComponent
],
  exports: [
    MemberMessagesComponent
  ]
})
export class MembersModule { }
