import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-ticker-tape',
  templateUrl: './ticker-tape.component.html',
})
export class TickerTapeComponent implements AfterViewInit {
  @ViewChild('tickerTapeContainer', { static: true })
  tickerTapeContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

      script.text = JSON.stringify({
        symbols: [
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
          { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
          { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
          { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
          { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
        ],
        showSymbolLogo: false,
        isTransparent: false,
        displayMode: 'regular',
        colorTheme: 'white',
        locale: 'en', // або 'uk'
      });

      this.tickerTapeContainer.nativeElement.appendChild(script);
    }
  }
}
