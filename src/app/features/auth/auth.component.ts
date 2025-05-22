import { Component, ViewChild } from '@angular/core';
import { Signup } from '../signup/models/signup.model';
import { Login } from '../signup/models/login.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { GoogleSigninService } from '../signup/services/google-signin.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
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
