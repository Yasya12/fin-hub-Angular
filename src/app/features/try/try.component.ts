import { AfterViewInit, Component} from '@angular/core';
import {  expandElement, slideUpDown } from '../../core/services/animation/signup_animation.service';
import { GoogleSigninService } from '../../core/services/google-signin.service';

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrl: './try.component.css',
  animations: [
    expandElement,
    slideUpDown
  ]
})
export class TryComponent implements AfterViewInit {
  isLoginVisible = false;

  constructor(
    private googleSigninService: GoogleSigninService,
  ) {}
  
  ngAfterViewInit(): void {
    // Load the Google SDK
    this.googleSigninService.loadSdk();
  }

  toggleLogin() {
    this.isLoginVisible = !this.isLoginVisible;
  }
}