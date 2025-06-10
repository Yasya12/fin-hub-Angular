import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/services/auth.service';
import { ScrollService } from './shared/services/scroll.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NewsComponent } from './shared/ui/news/news.component';
import { MessageService } from './features/messages/services/message.service';

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
  private readonly messageService = inject(MessageService);


  //States
  title = 'fin-hub';

  // HtmlElements
  scrollContainer = viewChild<ElementRef>('scrollContainer');

  ngOnInit(): void {
    this.authService.checkTokenExpiration();
    //this.messageService.loadMessages();
  }

  ngAfterViewInit(): void {
    this.scrollService.setScrollContainer(this.scrollContainer()!);
  }
}
