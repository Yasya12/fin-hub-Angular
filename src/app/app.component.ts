import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthService } from './features/signup/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'fin-hub';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkTokenExpiration();
  }
}
