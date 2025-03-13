import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthService } from "../../core/services/auth.service";
import { ErrorHandlerService } from "../../shared/services/error-handler.service";
import { GoogleSigninService } from './services/google-signin.service';
import { Router } from '@angular/router';
import { Login } from './models/login.model';
import { Signup } from './models/signup.model';
import { expandElement, fadeOut, slideUpDown } from '../../core/services/animation/signup_animation.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  animations: [expandElement, slideUpDown, fadeOut]
})
export class SignupComponent implements AfterViewInit {
  isSignUpVisible = false;
  errorMessage: string = '';

  @ViewChild('signupForm') signupForm!: NgForm;
  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(
    private googleSigninService: GoogleSigninService,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.googleSigninService.loadSdk();
  }

  toggleSignUp() {
    this.isSignUpVisible = !this.isSignUpVisible;
    this.errorMessage = "";
    this.clearForm();
  }

  loginInfo: Login = { email: '', password: '' };

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill in all fields correctly.";
      return;
    }
    this.authService.login(this.loginInfo).subscribe({
      next: () => {
        localStorage.setItem('selectedTab', 'home');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
      }
    });
  }

  signupData: Signup = { username: '', email: '', password: '' };

  signup() {
    if (this.signupForm.invalid) {
      this.errorMessage = "Please fill in all fields correctly.";
      return;
    }

    this.authService.signup(this.signupData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage = this.errorHandler.handleHttpError(err);
      }
    });
  }


  clearForm() {
    this.signupData = { username: '', email: '', password: '' };
    this.loginInfo = { email: '', password: '' };
    if (this.signupForm) this.signupForm.resetForm();
    if (this.loginForm) this.loginForm.resetForm();
  }
}