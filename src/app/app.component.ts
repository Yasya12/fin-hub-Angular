import { AfterViewInit, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/services/auth.service';
import { ScrollService } from './shared/services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  // Services
  private readonly authService = inject(AuthService);
  private readonly scrollService = inject(ScrollService);

  //States
  title = 'fin-hub';

  // HtmlElements
  scrollContainer = viewChild<ElementRef>('scrollContainer');

  ngOnInit(): void {
    this.authService.checkTokenExpiration();
  }

  ngAfterViewInit(): void {
    this.scrollService.setScrollContainer(this.scrollContainer()!);
  }
}
