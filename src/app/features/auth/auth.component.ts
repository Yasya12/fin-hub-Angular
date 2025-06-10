import { Component, inject, signal, ViewChild } from '@angular/core';
import { Signup } from '../signup/models/signup.model';
import { Login } from '../signup/models/login.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { GoogleSigninService } from '../signup/services/google-signin.service';
import { NotificationService } from '../notifications/services/notification.service';
import { MessageService } from '../messages/services/message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  //services
  private googleSigninService = inject(GoogleSigninService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  messageService = inject(MessageService);

  //states
  errorMessage: string = '';
  readonly currentTab = signal<'login' | 'signup'>(
    (this.route.snapshot.queryParamMap.get('tab') === 'signup') ? 'signup' : 'login'
  );

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.errorMessage = '';
      const tabParam = params.get('tab');
      this.currentTab.set(tabParam === 'signup' ? 'signup' : 'login');
    });
  }

  //hooks
  ngAfterViewInit(): void {
    this.googleSigninService.loadSdk();
  }

  //methods
  OnSignup(signupData: Signup) {
    this.authService.signup(signupData).subscribe({
      next: () => {
        this.notificationService.loadNotifications();
        this.messageService.loadMessages();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
      }
    });
  }

  OnLogin(loginData: Login) {
    this.authService.login(loginData).subscribe({
      next: () => {
        this.notificationService.loadNotifications();
        this.messageService.loadMessages();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
      }
    });
  }
}
