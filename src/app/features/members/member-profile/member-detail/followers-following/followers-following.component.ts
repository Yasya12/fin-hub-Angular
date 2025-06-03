import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowingService } from '../../../../followings/services/following.service';
import { Follow } from '../../../../followings/models/follow.interface';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/interfaces/user/user.interface';
import { ToastrService } from 'ngx-toastr';
import { use } from 'marked';

@Component({
  selector: 'app-followers-following',
  templateUrl: './followers-following.component.html',
  styleUrl: './followers-following.component.css'
})
export class FollowersFollowingComponent implements OnInit {
  //services
  followingService = inject(FollowingService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);
  toastr = inject(ToastrService);

  //states
  username!: string;
  mode!: 'followers' | 'following';
  list: Follow[] = [];
  currentUserEmail: string | undefined;

  //hooks
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.route.data.subscribe(data => {
        this.mode = data['mode'];
        this.loadFollows();
      });
    });

    this.currentUserEmail = this.authService.currentUser()?.user.email;
  }

  //methods
  loadFollows() {
    if (this.mode === 'followers') {
      this.followingService.getFollowersForSpecificUser(this.username).subscribe(users => {
        this.list = users;
      });
    } else {
      this.followingService.getFollowingsForSpecificUser(this.username).subscribe(users => {
        this.list = users;
      });
    }

    this.cdr.markForCheck();
  }

  selectTab(tab: 'followers' | 'following'): void {
    this.mode = tab;
    this.list = [];
    this.loadFollows();
  }

  toggleFollow(user: Follow): void {
    const isFollowing = user.isFollowedByCurrentUser;

    if (!isFollowing) {
      if (user.isUser) {
        this.followingService.followUser(user.followingId!).subscribe(() => {
          user.isFollowedByCurrentUser = !isFollowing;
          this.toastr.success(`Now you are following ${user.username}`);
        })
      }
      else {
        this.followingService.followHub(user.followingId!).subscribe(() => {
          user.isFollowedByCurrentUser = !isFollowing;
          this.toastr.success(`Now you are following ${user.username}`);
        })
      }
    } else {
      this.followingService.unfollow(user.followingId!).subscribe(() => {
        user.isFollowedByCurrentUser = !isFollowing;
        this.toastr.error(`You unfollowd ${user.username}`)
      })

    }
  }
}
