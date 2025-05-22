import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../../core/models/interfaces/user/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../messages/services/message.service';
import { Message } from '../../../messages/models/message.model';
import { firstValueFrom } from 'rxjs';
import { Follow } from '../../../followings/models/follow.interface';
import { FollowingService } from '../../../followings/services/following.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  //Services
  private messageService = inject(MessageService)
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService)
  router = inject(Router)

  //States
  user: User = {} as User;
  selectedTab: string = 'posts';
  //newMessages: Message[] = [];
  //groupMessages: { date: Date; messages: Message[]; }[] = [];
  // pageNumber = 1;
  // pageSize = 20;
  // hasMoreMessages = true;
  // totalPages = 1;
  isFollowing = false;
  isCurrentUser = false;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.user = data['user'];
        if (this.authService.currentUser()?.user.username == this.user.username) {
          this.isCurrentUser = true;
        }
      },
      error: err => console.error(err)
    })





    // this.route.queryParams.subscribe(params => {
    //   const tab = params['tab'];
    //   if (tab) {
    //     this.selectTab(tab);
    //   }
    // });
  }

  doNext(): void {
    if (this.isCurrentUser) {
      this.router.navigate(['/member/edit']);
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    // if (tab === 'messages') {
    //   this.loadMessages();
    // }
  }

  // onLoadMoreMessages() {
  //   this.pageNumber++;
  //   this.loadMessages();
  // }

  // async loadMessages() {
  //   if (!this.hasMoreMessages) {
  //     return;
  //   };

  //   await firstValueFrom(this.messageService.getMessageThread(this.user!.username, this.pageNumber, this.pageSize));

  //   const paginatedResult = this.messageService.paginatedThreadMessages();
  //   this.totalPages = Number(paginatedResult?.pagination?.totalPages ?? 1);

  //   if (!paginatedResult || !paginatedResult.items) return;

  //   if (paginatedResult.items.length < this.pageSize) {
  //     this.hasMoreMessages = false;
  //   }

  //   this.newMessages = paginatedResult.items!;
  // }

  toggleFollow(user: User): void {
    //this.authService.setCurerntUser();
    this.isFollowing = this.isFollowing ? false : true;

    if (this.isFollowing) {
      this.followingService.followUser(user.id).subscribe(() => {
        this.toastr.success(`Now you are following ${user.username}`);
      })
    } else {
      this.followingService.unfollow(user.id).subscribe(() => {
        this.toastr.error(`You unfollowd ${user.username}`)
      })

    }
  }
}
