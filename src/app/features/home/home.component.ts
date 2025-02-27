import { Component, OnInit } from '@angular/core';
import { AuthService } from '../signup/services/auth.service';
import { ResponseModel } from '../signup/models/response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  curretnUserEmail: string |null = null;
  curretnUser: ResponseModel |null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.curretnUserEmail = this.authService.currentUser()?.user.email ?? null;
    this.curretnUser = this.authService.currentUser();
  }
}
