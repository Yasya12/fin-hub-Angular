import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Login } from '../../signup/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //states
  loginData: Login = { email: '', password: '' };
  errorMessage: string = '';
  formSubmitted = false;

  //outputs
  @Input() externalError: string = '';
  @Output() loginFormOutput = new EventEmitter<Login>();

  //html elements
  @ViewChild('loginForm') loginForm!: NgForm;


  //methods
  login() {
    this.formSubmitted = true;
    if (!this.loginForm) {
      console.warn("loginForm is not initialized yet.");
      return;
    }

    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill in all fields correctly.";
      return;
    }

    this.loginFormOutput.emit(this.loginData);
    this.clearForm();
  }

  clearForm() {
    this.loginData = { email: '', password: '' };
    this.formSubmitted = false;
    if (this.loginForm) this.loginForm.resetForm();
  }
}
