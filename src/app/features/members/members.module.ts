import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MembersRoutingModule } from './members-routing.module';
import { FormsModule } from '@angular/forms';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberMessagesComponent } from './member-messages/member-messages.component';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';



@NgModule({
  declarations: [
    MemberEditComponent,
    MemberDetailComponent,
    MemberMessagesComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule,
    TimeAgoPipe
  ]
})
export class MembersModule { }
