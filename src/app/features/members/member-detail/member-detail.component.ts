import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../messages/services/message.service';
import { Message } from '../../messages/models/message.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  //Services
  private messageService = inject(MessageService)
  private route = inject(ActivatedRoute);

  //States
  user: User = {} as User;
  selectedTab: string = 'about';
  newMessages: Message[] = [];
  groupMessages: { date: Date; messages: Message[]; }[] = [];
  pageNumber = 1;
  pageSize = 20;
  hasMoreMessages = true;
  totalPages = 1;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.user = data['user'];
      },
      error: err => console.error(err)
    })

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.selectTab(tab);
      }
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'messages') {
      this.loadMessages();
    }
  }

  onLoadMoreMessages() {
    this.pageNumber++; 
    this.loadMessages(); 
  }
  
  async loadMessages() {
    if (!this.hasMoreMessages) {
      return;
    };

    await firstValueFrom(this.messageService.getMessageThread(this.user!.username, this.pageNumber, this.pageSize));

    const paginatedResult = this.messageService.paginatedThreadMessages();
    this.totalPages = Number(paginatedResult?.pagination?.totalPages ?? 1);

    if (!paginatedResult || !paginatedResult.items) return;

    if (paginatedResult.items.length < this.pageSize) {
      this.hasMoreMessages = false;
    }

    this.newMessages = paginatedResult.items!;
  }
}
