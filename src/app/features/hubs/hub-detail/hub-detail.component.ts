import { Component, inject, OnInit, signal } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HubService } from '../services/hub.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { FollowingService } from '../../followings/services/following.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hub-detail',
  templateUrl: './hub-detail.component.html',
  styleUrls: ['./hub-detail.component.css']
})
export class HubDetailComponent implements OnInit {
  //Services
  private hubService = inject(HubService);
  private readonly route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);

  //States
  hub = signal<Hub | undefined>(undefined);
  hubId: string | null = null;
  selectedTab: string = 'posts';
  userCanWritePost: boolean = false;
  currentUser: User | undefined
  isAdmin: boolean = false;

  isFollowing = false;

  //hooks
  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.currentUser = this.authService.currentUser()?.user;

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.selectTab(tab);
      }
    });

    this.loadHubId();
    this.isFollowingHub();
  }

  onHubSaved() {
    if (this.hubId) {
      this.loadHub(this.hubId);
    }
  }

  isFollowingHub() {
    if (this.hubId) {
      this.followingService.isFollowingHub(this.hubId).subscribe((result) =>
        this.isFollowing = result);
    }
  }


  loadHubId() {
    this.hubId = this.route.snapshot.paramMap.get('id');
    if (this.hubId) {
      this.loadHub(this.hubId);
      this.checkIfUserCanWritePost(this.hubId);
      this.isUserAdmin(this.hubId);
    }
  }

  loadHub(hubId: string) {
    this.hubService.getHubById(hubId).subscribe((hub) => {
      this.hub.set(hub);
    });
  }

  checkIfUserCanWritePost(hubId: string) {
    this.hubService.checkIfUserCanWritePost(hubId).subscribe((result) => {
      this.userCanWritePost = result;
    });
  }

  isUserAdmin(hubId: string) {
    this.hubService.isAdmin(hubId).subscribe((result) => {
      this.isAdmin = result;
    });
  }

  router = inject(Router);

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.router.navigate(['/hubs', this.hubId], { queryParams: { tab: tab } })
  }

  toggleFollow(hub: Hub): void {
    //this.authService.setCurerntUser();
    this.isFollowing = this.isFollowing ? false : true;

    if (this.isFollowing) {
      this.followingService.followHub(hub.id).subscribe(() => {
        this.toastr.success(`Now you are following ${hub.name}`);
      })
    } else {
      this.followingService.unfollow(hub.id).subscribe(() => {
        this.toastr.error(`You unfollowd ${hub.name}`)
      })

    }
  }
}
