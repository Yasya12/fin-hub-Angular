import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollContainerSource = new BehaviorSubject<ElementRef | null>(null);
  scrollContainer$ = this.scrollContainerSource.asObservable();

  setScrollContainer(container: ElementRef) {
    this.scrollContainerSource.next(container);
  }
}
