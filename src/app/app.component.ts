import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/services/auth.service';
import { ScrollService } from './shared/services/scroll.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreModule, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
