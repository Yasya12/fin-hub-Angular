import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FullUser } from '../../core/models/User/full_user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  curretnUserEmail: string |null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.curretnUserEmail = this.authService.currentUser()?.user.email ?? null;
  }
}
