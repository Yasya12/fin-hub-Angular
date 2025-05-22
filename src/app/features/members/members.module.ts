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



@NgModule({
  declarations: [
    MemberEditComponent,
    MemberDetailComponent,
    MemberMessagesComponent,
    MemberProfileComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule,
    TimeAgoPipe,
    NewsComponent
  ],
  exports: [
    MemberMessagesComponent
  ]
})
export class MembersModule { }
