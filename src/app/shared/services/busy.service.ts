import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  //Services
  private spinnerService = inject(NgxSpinnerService);

  //States
  busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'square-jelly-box'});
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }

}

