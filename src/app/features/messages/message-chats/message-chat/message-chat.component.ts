import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrl: './message-chat.component.css'
})
export class MessageChatComponent {
  private messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef)

  username = input.required<string>();
  newMessages = input.required<Message[]>();
  groupMessages: { date: Date; messages: Message[] }[] = [];
  oldHeight: number | undefined = undefined;
  firstTime: boolean = true;
  messageContent: string = '';
  loadingOldMessages = false;


  @Output() loadMoreMessages = new EventEmitter<void>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  initializing: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && !changes['username'].firstChange) {
      this.groupMessages = [];
      this.firstTime = true;
      this.initializing = true;
      this.scrollToBottom();
    }

    if (changes['newMessages']) {
      const messages = changes['newMessages'].currentValue as Message[];

      if (!this.loadingOldMessages) {
        this.groupMessages = [];
        this.addMessagesToGroup(messages, false);
        setTimeout(() => {
          this.scrollToBottom();
          this.initializing = false; // після автоскролу завершуємо ініціалізацію
        }, 0);
      } else {
        this.addMessagesToGroup(messages, false);
        setTimeout(() => {
          if (this.oldHeight) {
            const container = this.scrollContainer.nativeElement;
            container.scrollTop = container.scrollHeight - this.oldHeight;
          }
          this.loadingOldMessages = false;
        }, 0);
      }
    }
  }


  private addMessagesToGroup(messages: Message[], atEnd: boolean = true) {
    messages.forEach(message => this.addMessageToGroup(message, atEnd));
  }

  private addMessageToGroup(message: Message, atEnd: boolean = true) {
    const dateKey = new Date(message.messageSent).toDateString();
    const group = this.groupMessages.find(g => g.date.toDateString() === dateKey);

    if (group) {
      atEnd ? group.messages.push(message) : group.messages.unshift(message);
    } else {
      atEnd ? this.groupMessages.push({
        date: new Date(message.messageSent),
        messages: [message]
      }) : this.groupMessages.unshift({
        date: new Date(message.messageSent),
        messages: [message]
      });
    }
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
        next: (message) => {
          this.messageContent = '';
          this.addMessageToGroup(message, true); // Для нового повідомлення додаємо в кінець
          this.scrollToBottom();
        }
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onScroll() {
    if (this.initializing) return;

    const container = this.scrollContainer.nativeElement;
    if (container.scrollTop <= 1 && !this.loadingOldMessages) {
      this.oldHeight = container.scrollHeight;
      this.loadingOldMessages = true;
      this.loadMoreMessages.emit();
    }
  }



  private scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 0);
  }
}
