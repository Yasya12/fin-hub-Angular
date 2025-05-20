import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
})
export class NewsComponent implements AfterViewInit {
  @ViewChild('NewsWidgetContainer', { static: true })
  timelineWidgetContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';

      script.text = JSON.stringify({
        feedMode: 'Market',
        isTransparent: false,
        displayMode: 'regular',
        width: 320,
        height: 772,
        colorTheme: 'light',
        locale: 'en',
      });
      this.timelineWidgetContainer.nativeElement.appendChild(script);
    }
  }
}
