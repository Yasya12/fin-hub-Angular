import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessageChatsComponent } from './message-chats/message-chats.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent
  },
  {
    path: 'chats',
    component: MessageChatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {}
