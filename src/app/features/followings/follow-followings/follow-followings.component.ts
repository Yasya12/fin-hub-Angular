import { Component, inject, OnInit } from '@angular/core';
import { Follow } from '../models/follow.interface';
import { FollowingService } from '../services/following.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-follow-followings',
  templateUrl: './follow-followings.component.html',
  styleUrl: './follow-followings.component.css'
})
export class FollowFollowingsComponent implements OnInit {
  //services
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);

  //states
  follows: Follow[] | undefined
  isFollowing = true;

  //hooks
  ngOnInit(): void {
    this.loadFollows();
  }

  //methods
  loadFollows() {
  this.followingService.getFollowings().subscribe((result) => {
    this.follows = result;
  });
  }

  toggleFollow(follow: Follow): void {
    this.isFollowing = this.isFollowing ? false : true;

    if (this.isFollowing) {
      this.followingService.followUser(follow.followingId).subscribe(() => {
        this.toastr.success(`Now you are following ${follow.username}`);
      })
    } else {
      this.followingService.unfollow(follow.followingId).subscribe(() => {
        this.toastr.error(`You unfollowd ${follow.username}`)
      })

    }
  }
}
