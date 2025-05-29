import { trigger, transition, style, animate } from '@angular/animations';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { AuthStore } from '../../stores/auth-store';
import { User } from '../../models/interfaces/user/user.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-apart-aside',
  standalone: false,
  templateUrl: './apart-aside.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '75ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '50ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class ApartAsideComponent implements OnInit {
  //stores
  authService = inject(AuthService)

  //services
  router = inject(Router);

  //states
  user = computed<User | undefined>(() => {
    return this.authService.currentUser()?.user
  });

  @ViewChild('dropdown') dropdownRef!: ElementRef;
  showProfileDropDown = signal(false);

  ngOnInit(): void {
    this.authService.setCurerntUser();
  }

  navigateToSignup() {
    this.router.navigateByUrl(`/auth`);
    this.showProfileDropDown.set(false);
  }

  navigateToUserProfile(userName: string): void {
    this.router.navigate(['/member', userName]);
    this.showProfileDropDown.set(false);
  }

  navigateToEditUserProfile(): void {
    this.router.navigate(['/member/edit']);
    this.showProfileDropDown.set(false);
  }

  profileClicked() {
    this.showProfileDropDown.update((prev) => !prev);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const dropdownEl = this.dropdownRef?.nativeElement;
    if (dropdownEl && !dropdownEl.contains(event.target)) {
      this.showProfileDropDown.set(false);
    }
  }
}
