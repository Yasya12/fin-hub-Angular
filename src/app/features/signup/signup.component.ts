import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from "../../core/services/auth.service";
import { ValidationError } from "../../core/models/validation-error.model";
import { ErrorHandlerService } from "../../core/services/error-handler.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { expandElement, fadeOut, slideUpDown } from '../../core/services/animation/signup_animation.service';
import { GoogleSigninService } from '../../core/services/google-signin.service';
import { Router } from '@angular/router';
import { Login } from '../../core/models/login.model';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  animations: [
    expandElement,
    slideUpDown,
    fadeOut
  ]
})
export class SignupComponent implements AfterViewInit {
  isLoginVisible = false;

  constructor(
    private googleSigninService: GoogleSigninService,
    private authService: AuthService, 
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}
  
  ngAfterViewInit(): void {
    this.googleSigninService.loadSdk();
  }

  toggleLogin() {
    this.isLoginVisible = !this.isLoginVisible;
  }

  loginInfo: Login = {
      email: '',
      password: ''
    };

    errorMessage: string = '';

    login(credentials: Login) {
      this.authService.login(credentials).subscribe({
        next: (res) => {
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'This user does not exist or the password is incorrect';
          } else {
            if (err.error && err.error.errors) {
              const validationErrors: ValidationError = err.error.errors;
              this.errorMessage = this.errorHandler.formatErrors(validationErrors);
            } else {
              this.errorMessage = 'Something went wrong. Try again later.';
            }
          }
        }
      });
    } 
}