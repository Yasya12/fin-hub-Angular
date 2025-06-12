import {
  ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, untracked, ViewChild
} from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrl: './message-chat.component.css'
})
export class MessageChatComponent implements OnChanges {
  private messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef)
  toastService = inject(ToastrService);

  username = input.required<string>();
  oldHeight: number | undefined = undefined;
  firstTime: boolean = true;
  messageContent: string = '';
  loadingOldMessages = false;

  @Output() loadMoreMessages = new EventEmitter<void>();
  @Output() messageSend = new EventEmitter<void>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  initializing: boolean = true;
  groupMessages = signal<{ date: Date; messages: Message[] }[]>([]);

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['username'] && !changes['username'].firstChange) {
      this.groupMessages.set([]);
      this.firstTime = true;
      this.initializing = true;
      this.loadingOldMessages = false;
      this.scrollToBottom();
    }
  }

  effect = effect(() => {
    const paged = this.messageService.paginatedThreadMessages();
    this.cdr.markForCheck();

    untracked(() => {
      if (!paged) return;

      const messages = paged.items ?? [];

      if (this.loadingOldMessages) {

        this.addMessagesToGroup(messages, false);

        setTimeout(() => {
          this.cdr.detectChanges();
          setTimeout(() => {
            if (this.oldHeight) {
              const container = this.scrollContainer.nativeElement;
              container.scrollTop = container.scrollHeight - this.oldHeight;
            }
            this.loadingOldMessages = false;
          }, 0);
        }, 0);
      }
      else if (this.firstTime) {

        this.groupMessages.set([]);
        this.addMessagesToGroup(messages, false);
        setTimeout(() => {
          this.scrollToBottom();
          this.firstTime = false;
          this.initializing = false;
        }, 0);
      }
      else {

        this.addMessagesToGroup(messages, true);
        setTimeout(() => {
          this.cdr.detectChanges();
          this.scrollToBottom();
          this.loadingOldMessages = false;
        }, 0);
      }
    })
  });

  private addMessagesToGroup(messages: Message[], atEnd: boolean = true) {
    messages.forEach(message => this.addMessageToGroup(message, atEnd));
    const updatedIds = new Set(messages.map(m => m.id));

    this.groupMessages.update(groups =>
      groups.map(group => ({
        ...group,
        messages: group.messages.map(msg => {
          const updated = messages.find(m => m.id === msg.id);
          return updated ? { ...msg, ...updated } : msg;
        })
      }))
    );
  }

  private addMessageToGroup(message: Message, atEnd: boolean = true) {
    const dateKey = new Date(message.messageSent).toDateString();

    this.groupMessages.update(groups => {
      const index = groups.findIndex(g => g.date.toDateString() === dateKey);

      if (index !== -1) {
        const group = groups[index];

        // Перевірка, чи немає дубліката по id
        const exists = group.messages.some(m => m.id === message.id);
        if (exists) return groups;

        const updatedGroup: typeof group = {
          ...group,
          messages: atEnd
            ? [...group.messages, message]
            : [message, ...group.messages],
        };

        const newGroups = [...groups];
        newGroups[index] = updatedGroup;
        return newGroups;

      } else {
        // Нова дата — створюємо нову групу
        const newGroup = {
          date: new Date(message.messageSent),
          messages: [message],
        };
        return atEnd ? [...groups, newGroup] : [newGroup, ...groups];
      }
    });
  }


  async sendMessage() {
    if (this.messageContent.trim()) {
      await this.messageService.sendMessageSignal(this.username(), this.messageContent);
      this.messageContent = '';
      this.scrollToBottom();
      this.messageSend.emit();
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

  deleteMessage(messageId: string): void {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
      this.toastService.success('Message deleted successfully');
        this.groupMessages.update(groups => {
          return groups.map(group => ({
            ...group,
            messages: group.messages.filter(msg => msg.id !== messageId)
          })).filter(group => group.messages.length > 0); 
        });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }
}
