import { Component, inject, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-chats',
  templateUrl: './message-chats.component.html',
  styleUrl: './message-chats.component.css'
})
export class MessageChatsComponent implements OnInit {
  ngOnInit(): void {
    this.loadMessages();
  }


  private messageService = inject(MessageService)

  newMessages: Message[] = [];
  hasMoreMessages = true;
  pageNumber = 1;
  pageSize = 20;
  totalPages = 1;
  username = ""

  onChatSelected(username: string) {
    if (this.username != username) {
      this.username = username;
      this.newMessages = [];
      this.messageService.paginatedThreadMessages.set(undefined);
      this.pageNumber = 1;
      this.hasMoreMessages = true;
      this.loadMessages();
    }
  }

  async loadMessages() {
    if (!this.hasMoreMessages || this.username == "") {
      return;
    };

    await firstValueFrom(this.messageService.getMessageThread(this.username, this.pageNumber, this.pageSize));
    this.messageService.markMessagesAsRead(this.username).subscribe();


    const paginatedResult = this.messageService.paginatedThreadMessages();
    this.totalPages = Number(paginatedResult?.pagination?.totalPages ?? 1);

    if (!paginatedResult || !paginatedResult.items) return;

    if (paginatedResult.items.length < this.pageSize) {
      this.hasMoreMessages = false;
    }

    this.newMessages = paginatedResult.items!;
  }

  onLoadMoreMessages() {
    this.pageNumber++;
    this.loadMessages();
  }
}
