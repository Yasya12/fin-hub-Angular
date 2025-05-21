import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ResponseModel } from '../../../shared/models/interfaces/response.model';

@Component({
  selector: 'app-following-list',
  templateUrl: './following-list.component.html',
  styleUrl: './following-list.component.css'
})
export class FollowingListComponent {
 //Services
  private readonly route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  //States
  followingId: string | null = null;
  selectedTab: string = 'posts';
  currentUser: User | undefined
  currentUserResponse: ResponseModel | undefined


  //hooks
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser()?.user;
    this.currentUserResponse = this.authService.currentUser();

    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.selectTab(tab);
      }
    });
  }
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
