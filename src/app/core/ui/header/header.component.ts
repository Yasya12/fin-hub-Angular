import { ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User/user.model.';
import { FullUser } from '../../models/User/full_user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  selectedTab = signal<string>(typeof window !== 'undefined' ? localStorage.getItem('selectedTab') || 'home' : 'home');
  menuItems = [
    { key: 'home', icon: 'home_icon', chosenIcon: 'chosen_home_icon', route: '/home' },
    { key: 'following', icon: 'following_icon', chosenIcon: 'chosen_following_icon', route: '/under-development' },
    { key: 'answer', icon: 'answer_icon', chosenIcon: 'chosen_answer_icon', route: '/under-development' },
    { key: 'hubs', icon: 'hubs_icon', chosenIcon: 'chosen_hubs_icon', route: '/under-development' },
    { key: 'notifications', icon: 'notifications_icon', chosenIcon: 'chosen_notifications_icon', route: '/under-development' },
  ];
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;

  constructor(
    protected authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTab', this.selectedTab());
      }
    });
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  selectTab(tab: string) {
    this.selectedTab.set(tab);

    if (tab === 'signup') {
      this.router.navigate(['/signup']);
    }
    else if (tab === 'askQuestion') {
      this.router.navigate(['/under-development']);
    } else {
      const route = this.menuItems.find(item => item.key === tab)?.route || '/home';
      this.router.navigate([route]);
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (
      this.dropdownMenu &&
      !this.dropdownMenu.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
