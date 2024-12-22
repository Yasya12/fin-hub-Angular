import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  loggedIn = false;
  isDropdownOpen = false;
  user: any = null;
  userEmail: string | null = null;
  cdRef: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
  
    if (token) {
      this.loggedIn = true;
      this.authService.user$.subscribe(user => {
        this.user = user; // Оновлюємо значення user
        if (!user) {
          this.router.navigate(['/login']); // Перенаправлення, якщо користувач неавторизований
        }
      }, error => {
        console.error('Error fetching user data', error);
        this.authService.logout(); // Якщо сталася помилка, вийти з системи
      });
    } else {
      // Якщо токен відсутній, користувач не авторизований
      this.user = null;
    }
  }

  toggleDropdown() {
    console.log("Dropdown toggled: ", this.isDropdownOpen);  // Debugging log
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']); 
  }
}