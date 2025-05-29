import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../../core/models/interfaces/user/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
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
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService)
  router = inject(Router)
  resetPosts = signal(true);

  //States
  user: User = {} as User;
  selectedTab: string = 'posts';
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
  }

  onResetHandled() {
    this.resetPosts.set(false);
  }

  doNext(): void {
    if (this.isCurrentUser) {
      this.router.navigate(['/member/edit']);
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleFollow(user: User): void {
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
