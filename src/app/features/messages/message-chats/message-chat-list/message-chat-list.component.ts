import { ChangeDetectorRef, Component, computed, effect, EventEmitter, inject, input, OnChanges, OnInit, Output, signal, Signal, SimpleChanges } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ChatUserDto } from '../../models/chatUser.model';
import { Router } from '@angular/router';
import { PresenceService } from '../../../../core/services/presence.service';

@Component({
  selector: 'app-message-chat-list',
  templateUrl: './message-chat-list.component.html',
  styleUrl: './message-chat-list.component.css'
})
export class MessageChatListComponent implements OnInit {
  //services
  messageService = inject(MessageService)
  cdr = inject(ChangeDetectorRef)
  router = inject(Router)
  private presenceService = inject(PresenceService);

  //states
  //userChats = signal<ChatUserDto[]>([]);
   userChats = this.messageService.chatUsers;
  searchText = signal('');

  //input properties
  isThereNewMessages = input<boolean>();
  activeUsername = input<string>('');

  @Output() selectChat = new EventEmitter<string>();

  filteredChats: Signal<ChatUserDto[]> = computed(() => {
    const activeUser = this.activeUsername();
    const search = this.searchText().toLowerCase();
    const onlineUserEmails = new Set(this.presenceService.onlineUsers());

    return this.userChats()
      .map(chat => ({
        ...chat,
        // isSelected тепер не зберігається, а обчислюється на льоту!
        isOnline: onlineUserEmails.has(chat.email),
        isSelected: chat.username === activeUser,
        unreadCount: chat.username === activeUser ? 0 : chat.unreadCount
      }))
      .filter(chat =>
        chat.username?.toLowerCase().includes(search)
      )
      .sort((a, b) => {
        const dateA = new Date(a.lastMessageSent).getTime();
        const dateB = new Date(b.lastMessageSent).getTime();
        return dateB - dateA; // Новіші спочатку
      });
  });

  // constructor() {
  //   // Effect для перезавантаження чатів при отриманні нового повідомлення
  //   effect(() => {
  //     if (this.isThereNewMessages()) {
  //       console.log("new chats")
  //       this.loadUserChats();
  //     }
  //   });
  // }

  //hooks
  ngOnInit(): void {
   //this.loadUserChats();
   this.messageService.loadUsersChat();
  }

  //methods
  onSelectChat(chosenChat: ChatUserDto) {
    const currentMessages = this.messageService.messages();
    this.messageService.messages.set(Math.max(0, currentMessages - chosenChat.unreadCount));
    this.messageService.loadUsersChat();

    this.router.navigate(['/messages/chats', chosenChat.username]);
    this.selectChat.emit(chosenChat.username);
  }

  // loadUserChats() {
  //   this.messageService.getUsersChat().subscribe((result) => {
  //     this.userChats.set(result);
  //   })
  // }
}
