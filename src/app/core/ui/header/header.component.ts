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
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../features/notifications/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [AuthStore],
})
export class HeaderComponent implements OnInit {
  //TODO: clean the code in the component
  //Stores
  authStore = inject(AuthStore);

  //Services
  toastr = inject(ToastrService);
  notificationService = inject(NotificationService);

  //States
  isDropdownOpen = false;
  isLoggedIn = signal<boolean>(false);
  hasUnreadNotifications = signal<boolean>(false);

  menuItems = [
    {
      key: 'Hubs',
      name: 'Спільноти',
      icon: 'hubs_icon',
      chosenIcon: 'chosen_hubs_icon',
      route: '/hubs',
    },
    {
      key: 'News',
      name: 'Новини',
      icon: '',
      chosenIcon: '',
      route: '/news',
    },
    {
      key: 'About Us',
      name: 'Про нас',
      icon: '',
      chosenIcon: '',
      route: '/aboutus',
    },
    {
      key: 'Contact Us',
      name: 'Контакти',
      icon: '',
      chosenIcon: '',
      route: '/contactus'
    },
  ];
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;

  constructor(protected authService: AuthService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isDropdownOpen = false;
      }
      if (event instanceof NavigationEnd) {
        // This will run after navigation has completed
        if (event.urlAfterRedirects === '/home') {
          this.selectTab('home');
        }
      }
    });

    effect(
      () => {
        const unreadCount = this.notificationService.unreadCount();
        this.hasUnreadNotifications.set(unreadCount > 0);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      this.authStore.setCurrentUserState();
    });
  }

  ngOnInit(): void {
    this.authService.setCurerntUser(); //so when i refresh i will see the loged user, because without it i wont\

    this.notificationService.getAllNotificationsForUser();
  }

  selectTab(tab: string) {
    if (tab === 'signup') {
      this.router.navigate(['/signup']);
    } else if (tab === 'messages' && !this.authService.currentUser()) {
      this.toastr.warning('You need to be logged in to access the messages');
      this.router.navigate(['/signup']);
      return;
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
