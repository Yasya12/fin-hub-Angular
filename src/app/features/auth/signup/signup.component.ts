import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Signup } from '../../signup/models/signup.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  //states
  signupData: Signup = { username: '', email: '', password: '' };
  errorMessage: string = '';
  formSubmitted = false;

  //outputs

  @Input() externalError: string = '';
  @Output() signupFormOutput = new EventEmitter<Signup>();

  //html elements
  @ViewChild('signupForm') signupForm!: NgForm;

  //methods
  signup() {
    this.formSubmitted = true;
    if (this.signupForm.invalid) {
      this.errorMessage = "Please fill in all fields correctly.";
      return;
    }

    this.signupFormOutput.emit(this.signupData);
    this.clearForm();
  }

  clearForm() {
    this.signupData = { username: '', email: '', password: '' };
    this.formSubmitted = false;
    if (this.signupForm) this.signupForm.resetForm();
  }
}
