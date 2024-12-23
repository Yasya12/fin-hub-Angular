import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model.';
import { FullUser } from '../../models/full_user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.setCurrentUser();
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
