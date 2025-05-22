import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ChatUserDto } from '../../models/chatUser.model';

@Component({
  selector: 'app-message-chat-list',
  templateUrl: './message-chat-list.component.html',
  styleUrl: './message-chat-list.component.css'
})
export class MessageChatListComponent implements OnInit {
  //services
  messageService = inject(MessageService)
  cdr = inject(ChangeDetectorRef)

  //states
  userChats: ChatUserDto[] | undefined
  searchText = '';

  @Output() selectChat = new EventEmitter<string>();

  //hooks
  ngOnInit(): void {
    this.loadUserChats();
  }

  //methods
  onSelectChat(chosenChat: ChatUserDto) {
    chosenChat.unreadCount = 0;

    for (const chat of this.userChats!) {
      chat.isSelected = false;
    }
    chosenChat.isSelected = true;
    
    this.cdr.markForCheck();
    this.selectChat.emit(chosenChat.username);
  }

  loadUserChats() {
    this.messageService.getUsersChat().subscribe((result) => {
      this.userChats = result;
    })
  }

  get filteredChats(): ChatUserDto[] {
    if (!this.userChats) return [];
    return this.userChats.filter(chat =>
      chat.username?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
