import { Component, inject, OnInit, signal } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { ActivatedRoute } from '@angular/router';
import { HubService } from '../services/hub.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/interfaces/user/user.interface';

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

  //States
  hub = signal<Hub | undefined>(undefined);
  hubId: string | null = null;
  selectedTab: string = 'posts';
  userCanWritePost: boolean = false;
  currentUser: User | undefined
  isAdmin: boolean = false;

  //hooks
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser()?.user;

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.selectTab(tab);
      }
    });

    this.loadHubId();
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

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
