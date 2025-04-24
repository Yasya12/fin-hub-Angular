import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from './services/message.service';
import { firstValueFrom } from 'rxjs';
import { PostDetailStore } from '../post-detail/stores/post-detail/post-detail.store';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  providers: [PostDetailStore]
})
export class MessagesComponent implements OnInit {
  //Services
  messageService = inject(MessageService);

  //Stores
  posrDetailStore = inject(PostDetailStore); //TODO: write a store for the auth and dont use the post detail store here

  //States
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;

  //hooks
  ngOnInit(): void {
    this.loadMessages();
  }

  //methods\
  async loadMessages() {
    const currentUsername = this.posrDetailStore.getCurrentUser()?.username;
    if(!currentUsername) {
      console.error('No current user found. Cannot load messages.');
      return;
    }

    await firstValueFrom(this.messageService.getMessages(this.pageNumber, this.pageSize, currentUsername!, this.container));
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
