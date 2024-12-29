import {Component, OnInit} from '@angular/core';
import {User} from "../../core/models/user.model.";
import {AuthService} from "../../core/services/auth.service";
import {ValidationError} from "../../core/models/validation-error.model";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.5)' // початковий масштаб (малий)
        }),
        animate('700ms', style({
          opacity: 1,
          transform: 'scale(1)' // фінальний масштаб (нормальний)
        }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {
  user: User = {
    email: '',
    username: '',
    role: '',
    profilePictureUrl: ''
  };
  errorMessage: string = '';
  constructor(private authService: AuthService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
  }
  signup(credentials: User) {
    console.log(credentials);
    this.authService.signup(credentials).subscribe({
      next: (res) => {
        console.log('Success:', res);
        // Redirect to user dashboard or handle successful response here
      },
      error: (err) => {
        console.log('Error:', err);
        const validationErrors: ValidationError = err.error.errors;
        this.errorMessage = this.errorHandler.formatErrors(validationErrors);
      }
    });
  }

  protected readonly Object = Object;
}
