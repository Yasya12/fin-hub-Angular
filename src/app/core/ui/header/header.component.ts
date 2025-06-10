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
import { NavigationEnd, NavigationExtras, NavigationStart, Router } from '@angular/router';
import { AuthStore } from '../../stores/auth-store';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../features/notifications/services/notification.service';
import { SearchResult, SearchService } from '../../services/search.service';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap, tap } from 'rxjs';

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

  searchResults = signal<SearchResult | null>(null);
  isSearchLoading = signal(false);
  isDropdownVisible = signal(false);
  showProfileDropDown = signal(false);

  // ✅ 5. RxJS для обробки вводу
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  private searchService = inject(SearchService);
  private elementRef = inject(ElementRef);


  // ✅ 6. Обробка кліків поза компонентом для закриття випадаючого меню пошуку
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Цей код закриває і меню профілю, і меню пошуку, якщо клік був поза ними
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showProfileDropDown.set(false);
      this.isDropdownVisible.set(false);
    }
  }

  menuItems = [
    {
      key: 'hubs',
      name: 'Спільноти',
      route: '/hubs',
    },
    {
      key: 'about',
      name: 'Про нас',
      route: '/info/about',
    },
    {
      key: 'contact',
      name: 'Контакти',
      route: '/info/contact',
    },
  ];
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;

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
      console.log('Navigating to route:', route);
      this.router.navigate([route]);
    }
  }

  constructor(protected authService: AuthService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isDropdownOpen = false;
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
    this.authService.setCurerntUser();
    this.notificationService.getAllNotificationsForUser();

    // ✅ 7. Налаштовуємо "живий" пошук
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isSearchLoading.set(true)),
      switchMap(term => {
        if (term.length < 2) {
          this.isSearchLoading.set(false);
          this.searchResults.set(null);
          return of(null);
        }
        return this.searchService.search(term).pipe(
          catchError(() => {
            this.isSearchLoading.set(false);
            return of(null);
          })
        );
      })
    ).subscribe(results => {
      this.isSearchLoading.set(false);
      this.searchResults.set(results);
    });
  }

  ngOnDestroy(): void {
    // ✅ 8. Відписуємось від searchSubscription, щоб уникнути витоків пам'яті
    this.searchSubscription.unsubscribe();
  }

  profileClicked(event: MouseEvent) {
    event.stopPropagation();
    this.showProfileDropDown.update(value => !value);
  }

  navigateTo(path: any[], extras?: NavigationExtras): void {
    // Закриваємо всі випадаючі меню
    this.isDropdownVisible.set(false);
    this.showProfileDropDown.set(false);
    
    // Виконуємо навігацію з переданими шляхом та опціями
    this.router.navigate(path, extras);
  }

  // ✅ 9. Нові та змінені методи для пошуку

  // Цей метод викликається на КОЖНУ зміну в полі вводу
  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    // Показуємо дропдаун одразу, як тільки користувач починає вводити
    this.isDropdownVisible.set(true);
    this.searchSubject.next(term);
  }

  // Метод для переходу на сторінку, коли юзер клікає на результат
  navigateToSearchResult(path: any[]): void {
    this.isDropdownVisible.set(false); // Закриваємо меню
    this.router.navigate(path);
    // Опціонально: очистити поле пошуку
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

  onSearch(searchTerm: string): void {
    // Обрізаємо зайві пробіли і перевіряємо, чи запит не порожній
    const term = searchTerm.trim();
    if (term) {
      // Перенаправляємо користувача на сторінку /search
      // і передаємо пошуковий запит як параметр 'q'
      this.router.navigate(['/search'], { queryParams: { q: term } });
    }
  }
}
