import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MessageService } from './services/message.service';
import { firstValueFrom } from 'rxjs';
import { PostDetailStore } from '../post-detail/stores/post-detail/post-detail.store';
import { Message } from './models/message.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  providers: [PostDetailStore]
})
export class MessagesComponent implements OnInit {
  //Services
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);

  //Stores
  posrDetailStore = inject(PostDetailStore); //TODO: write a store for the auth and dont use the post detail store here

  //States
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 8;
  messagesLoaded = false;
  isOutbox = this.container === "Outbox"

  //hooks
  ngOnInit(): void {
    this.loadMessages();
  }

  //methods
  async loadMessages() {
    const currentUsername = this.posrDetailStore.getCurrentUser()?.username;
    if (!currentUsername) {
      console.error('No current user found. Cannot load messages.');
      return;
    }

    await firstValueFrom(this.messageService.getMessages(this.pageNumber, this.pageSize, currentUsername!, this.container));
    this.messagesLoaded = true;
    this.cdr.markForCheck();
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messageService.paginatedResult.update((prev) => {
        if (prev && prev.items) {
          prev.items.splice(prev.items.findIndex((m) => m.id === id), 1);
          return prev;
        }
        return prev;
      });
    });
  }

  getRoute(message: Message) {
    if (this.container === 'Outbox') return `/member/${message.recipientUserName}`;
    else return `/member/${message.senderUserName}`;
  }

  pageChanged(newPage: number) {
    if (this.pageNumber !== newPage) {
      this.pageNumber = newPage;
      this.loadMessages();
    }
  }
  
  previousPage() {
    if (this.pageNumber > 1) {
      this.pageChanged(this.pageNumber - 1);
    }
  }
  
  nextPage() {
    if (this.pageNumber < this.messageService.paginatedResult()!.pagination!.totalPages) {
      this.pageChanged(this.pageNumber + 1);
    }
  }
  
  getPages(): number[] {
    const totalPages = this.messageService.paginatedResult()?.pagination?.totalPages || 0;
    const currentPage = this.pageNumber;
    const pagesToShow = 5; // Скільки сторінок показувати поруч з активною
  
    let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
    let endPage = startPage + pagesToShow - 1;
  
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }
  
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return pages;
  }
  
  

  setContainer(value: string) {
    this.container = value;
    this.loadMessages();
  }
}
