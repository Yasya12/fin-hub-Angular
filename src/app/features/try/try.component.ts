import { AfterViewInit, Component} from '@angular/core';
import {  expandElement, slideUpDown, fadeOut } from '../../core/services/animation/signup_animation.service';
import { GoogleSigninService } from '../../core/services/google-signin.service';
import { Login } from '../../core/models/login.model';
import {AuthService} from "../../core/services/auth.service";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {ValidationError} from "../../core/models/validation-error.model";
import { Router } from '@angular/router';

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrl: './try.component.css',
  animations: [
    expandElement,
    slideUpDown,
    fadeOut
  ]
})
export class TryComponent implements AfterViewInit {
  isLoginVisible = false;

  constructor(
    private googleSigninService: GoogleSigninService,
    private authService: AuthService, 
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}
  
  ngAfterViewInit(): void {
    // Load the Google SDK
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
    successMessage: string = ''; 

    login(credentials: Login) {
      this.authService.login(credentials).subscribe({
        next: (res) => {
          this.successMessage = 'Login successful! Redirecting...';
          console.log(this.successMessage);
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