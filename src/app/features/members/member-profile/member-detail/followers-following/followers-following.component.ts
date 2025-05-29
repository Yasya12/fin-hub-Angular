import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowingService } from '../../../../followings/services/following.service';
import { Follow } from '../../../../followings/models/follow.interface';

@Component({
  selector: 'app-followers-following',
  templateUrl: './followers-following.component.html',
  styleUrl: './followers-following.component.css'
})
export class FollowersFollowingComponent implements OnInit {
  //services
  followingService = inject(FollowingService);
  route = inject(ActivatedRoute);
  //toastr = inject(ToastrService);

  //states
  username!: string;
  mode!: 'followers' | 'following';
  list: Follow[] = [];

  //hooks
  ngOnInit(): void {
    this.loadFollows();
  }

  //methods
  loadFollows() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.mode = this.route.snapshot.data['mode'];

    if (this.mode === 'followers') {
      this.followingService.getFollowersForSpecificUser(this.username).subscribe(users => {
        this.list = users;
      });
    } else {
      this.followingService.getFollowingsForSpecificUser(this.username).subscribe(users => {
        this.list = users;
      });
    }
  }
}
