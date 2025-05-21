import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';
import { MessageChatsComponent } from './message-chats/message-chats.component';
import { MembersModule } from '../members/members.module';
import { MemberMessagesComponent } from '../members/member-messages/member-messages.component';
import { MessageChatComponent } from './message-chat/message-chat.component';
import { MessageChatListComponent } from './message-chat-list/message-chat-list.component';



@NgModule({
  declarations: [
    MessagesComponent,
    MessageChatsComponent,
    MessageChatComponent,
    MessageChatListComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule,
    TimeAgoPipe
  ]
})
export class MessagesModule { }
