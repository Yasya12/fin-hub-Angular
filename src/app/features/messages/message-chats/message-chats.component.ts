// message-chats.component.ts

import { ChangeDetectorRef, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../services/message.service';
// ... інші імпорти

@Component({
  selector: 'app-message-chats',
  templateUrl: './message-chats.component.html',
  styleUrl: './message-chats.component.css'
})
export class MessageChatsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  messages = computed(() => this.messageService.paginatedThreadMessages()?.items ?? []);
  pagination = computed(() => this.messageService.paginatedThreadMessages()?.pagination);

  pageNumber = 1;
  pageSize = 20;
  username = "";
  isThereNewMessages = signal(false);
  isLoading = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const usernameFromRoute = params.get('username');
      if (usernameFromRoute && this.username !== usernameFromRoute) {
        this.username = usernameFromRoute;
        this.pageNumber = 1;

        this.isLoading.set(false);
        this.messageService.paginatedThreadMessages.set(undefined);

        const user = this.authService.currentUser();
        if (user) {
          this.messageService.createHubConnection(user, this.username).then(() => {
            this.loadMessages(true);
          });
        }
      }
    });
  } cdr = inject(ChangeDetectorRef);

  async loadMessages(isInitialLoad = false) {
    if (this.isLoading()) {
      return;
    }

    const currentPage = this.pagination()?.currentPage ?? 0;
    const totalPages = this.pagination()?.totalPages ?? 1;

    if (!isInitialLoad && currentPage >= totalPages) {
      return;
    }

    this.isLoading.set(true);
    await this.messageService.getMessageThread(this.username, this.pageNumber, this.pageSize);

    const currentMessages = this.messageService.paginatedThreadMessages()?.items ?? [];
    const unreadMessageIds = currentMessages
      .filter(m => !m.dateRead && m.senderUserName === this.username)
      .map(m => m.id);

    // 3. Якщо є що оновлювати, робимо це локально і відправляємо підтвердження на сервер
    if (unreadMessageIds.length > 0) {
      // Оновлюємо свій UI негайно (оптимістично)
      (this.messageService as any).updateMessagesAsRead(unreadMessageIds); // Викликаємо приватний метод
      // Надсилаємо ID на сервер, щоб він повідомив відправника
      await this.messageService.acknowledgeMessagesRead(unreadMessageIds);
    }

    this.isLoading.set(false);
    this.cdr.markForCheck(); // О
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  onLoadMoreMessages() {
    this.pageNumber++;
    this.loadMessages();
  }
  onSendMessage() {
     this.messageService.updateChatOnSentMessage(this.username);
    this.isThereNewMessages.set(true);
    setTimeout(() => this.isThereNewMessages.set(false), 0);
  }
}