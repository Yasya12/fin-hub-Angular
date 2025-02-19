import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../features/signup/services/auth.service';
import { User } from '../../models/User/user.model.';
import { FullUser } from '../../models/User/full_user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  selectedTab = signal('home');
  menuItems = [
    { key: 'home', icon: 'home_icon', chosenIcon: 'chosen_home_icon', route: '/home' },
    { key: 'following', icon: 'following_icon', chosenIcon: 'chosen_following_icon' },
    { key: 'answer', icon: 'answer_icon', chosenIcon: 'chosen_answer_icon' },
    { key: 'hubs', icon: 'hubs_icon', chosenIcon: 'chosen_hubs_icon' },
    { key: 'notifications', icon: 'notifications_icon', chosenIcon: 'chosen_notifications_icon' },
  ];

  constructor(protected authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  selectTab(tab: string) {
    this.selectedTab.set(tab);
    this.cdr.detectChanges();
    if (tab === 'signup') {
      this.router.navigate(['/signup']);
    } else {
      this.router.navigate([this.menuItems.find(item => item.key === tab)?.route || '/home']);
    }
  }

  setCurrentUser() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userString && token) {
      const user: User = JSON.parse(userString);
      const fullUser: FullUser = { user, token };
      this.authService.currentUser.set(fullUser);
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
