import { Component, inject, OnInit } from '@angular/core';
import { Follow } from '../../models/follow.interface';
import { FollowingService } from '../../services/following.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-follow-followings',
  templateUrl: './follow-followings.component.html',
  styleUrl: './follow-followings.component.css'
})
export class FollowFollowingsComponent implements OnInit {
  //services
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);

  //states
  follows: Follow[] | undefined
  currentUserEmail: string | undefined;
  curentUsername: string | undefined;

  //hooks
  ngOnInit(): void {
    this.currentUserEmail = this.authService.currentUser()?.user.email;
    this.curentUsername = this.authService.currentUser()?.user.username;
    
    this.loadFollows();
  }

  //methods
  loadFollows() {
    this.followingService.getFollowingsForSpecificUser(this.curentUsername!).subscribe((result) => {
      this.follows = result;
      console.log(result)
    });
  }

  toggleFollow(user: Follow): void {
    const isFollowing = user.isFollowedByCurrentUser;

    if (!isFollowing) {
      if (user.isUser) {
        this.followingService.followUser(user.followingId!).subscribe(() => {
          console.log(1)
          user.isFollowedByCurrentUser = !isFollowing;
          this.toastr.success(`Now you are following ${user.username}`);
        })
      }
      else {
        this.followingService.followHub(user.followingId!).subscribe(() => {
          console.log(2)
          user.isFollowedByCurrentUser = !isFollowing;
          this.toastr.success(`Now you are following ${user.username}`);
        })
      }
    } else {
      this.followingService.unfollow(user.followingId!).subscribe(() => {
        console.log(3)
        user.isFollowedByCurrentUser = !isFollowing;
        this.toastr.error(`You unfollowd ${user.username}`)
      })

    }
  }
}
