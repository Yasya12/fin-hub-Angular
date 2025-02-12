import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from '../../../core/core.module';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CoreModule],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {

}
