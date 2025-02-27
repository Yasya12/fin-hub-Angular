import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-charts-view',
  templateUrl: './charts-view.component.html',
  styleUrl: './charts-view.component.css'
})
export class ChartsViewComponent implements AfterViewInit {
  @ViewChild('miniWidgetContainer', { static: true }) miniWidgetContainer!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';

      script.text = JSON.stringify({
        "title": "Market Overview",
        "tabs": [
          {
            "title": "US Market",
            "symbols": [
              { "s": "NASDAQ:NDX" },
              { "s": "NASDAQ:META" },
              { "s": "NYSE:V" },
              { "s": "NASDAQ:GOOGL" },
              { "s": "NASDAQ:MSFT" },
              { "s": "NYSE:TSM" },
              { "s": "NASDAQ:NVDA" },
              { "s": "NASDAQ:AMZN" },
              { "s": "NYSE:KO" },
              { "s": "NYSE:UBER" }
            ]
          }
        ],
        "width": "100%",
        "height": 800,
        "locale": "en",
      });
      

      this.miniWidgetContainer.nativeElement.appendChild(script);
    }
  }
}
