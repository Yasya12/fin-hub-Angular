import { trigger, transition, style, animate } from '@angular/animations';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';

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
export class ApartAsideComponent {
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  showProfileDropDown = signal(false);

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
