import { Component, ElementRef, EventEmitter, inject, input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, effect, computed } from '@angular/core';
import { MessageService } from '../../messages/services/message.service';
import { Message } from '../../messages/models/message.model';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnChanges {
  private messageService = inject(MessageService);

  username = input.required<string>();
  newMessages = input.required<Message[]>();
  groupMessages: { date: Date; messages: Message[] }[] = [];
  oldHeight: number | undefined = undefined;
  firstTime: boolean = true;
  messageContent: string = '';

  @Output() loadMoreMessages = new EventEmitter<void>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newMessages']) {
      const messages = changes['newMessages'].currentValue as Message[];
      this.addMessagesToGroup(messages, false);

      if (this.firstTime && this.scrollContainer) {
        this.scrollToBottom();
        this.firstTime = false;
      } else {
        setTimeout(() => {
          if (this.oldHeight) {
            this.scrollContainer.nativeElement.scrollTop =
              this.scrollContainer.nativeElement.scrollHeight - this.oldHeight;
          }
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
      })  : this.groupMessages.unshift({
        date: new Date(message.messageSent),
        messages: [message]
      })  ;
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
    const container = this.scrollContainer.nativeElement;
    if (container.scrollTop < 1) {
      this.oldHeight = container.scrollHeight;
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
