import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ResponseModel } from '../signup/models/response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
})
export class HomeComponent implements OnInit {
  // Services
  private readonly authService = inject(AuthService);

  // States
  curretnUser: ResponseModel | undefined = undefined;

  // Lifecycle hooks
  ngOnInit(): void {
    this.curretnUser = this.authService.currentUser();
  }
}