import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthStore } from '../../stores/auth-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [AuthStore]
})
export class HeaderComponent implements OnInit {
  //TODO: clean the code in the component
  //Stores
  authStore = inject(AuthStore);

  //States
  isDropdownOpen = false;
  selectedTab = signal<string>(
    typeof window !== 'undefined'
      ? localStorage.getItem('selectedTab') || 'home'
      : 'home'
  );
  menuItems = [
    {
      key: 'home',
      icon: 'home_icon',
      chosenIcon: 'chosen_home_icon',
      route: '/home',
    },
    {
      key: 'following',
      icon: 'following_icon',
      chosenIcon: 'chosen_following_icon',
      route: '/under-development',
    },
    {
      key: 'messages',
      icon: 'answer_icon',
      chosenIcon: 'chosen_answer_icon',
      route: '/messages',
    },
    {
      key: 'hubs',
      icon: 'hubs_icon',
      chosenIcon: 'chosen_hubs_icon',
      route: '/under-development',
    },
    {
      key: 'notifications',
      icon: 'notifications_icon',
      chosenIcon: 'chosen_notifications_icon',
      route: '/under-development',
    },
  ];
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;

  constructor(protected authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isDropdownOpen = false;
      }
      if (event instanceof NavigationEnd) {  // This will run after navigation has completed
        if (event.urlAfterRedirects === '/home') {
          this.selectTab('home');
        }
      }
    });

    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTab', this.selectedTab());
      }
    });

    effect(() => {
      this.authStore.setCurrentUserState();
    });
  }

  ngOnInit(): void {
    this.authService.setCurerntUser(); //so when i refresh i will see the loged user, because without it i wont\
  }

  selectTab(tab: string) {
    this.selectedTab.set(tab);

    if (tab === 'signup') {
      this.router.navigate(['/signup']);
    } else if (tab === 'askQuestion') {
      this.router.navigate(['/under-development']);
    } else if (tab === 'edit-member') {
      this.router.navigate(['/member/edit']);
    } else {
      const route =
        this.menuItems.find((item) => item.key === tab)?.route || '/home';
      this.router.navigate([route]);
    }
  }
  

  logout() {
    this.selectedTab.set('home');
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
