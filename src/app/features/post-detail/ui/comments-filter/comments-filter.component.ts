import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommentDisplay } from '../../../../core/models/Comment/commentDisplay.model';

@Component({
  selector: 'app-comments-filter',
  templateUrl: './comments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("expand-collapse", [
      state("expanded", style({ height: "*", visibility: "visible" })),
      state("collapsed", style({ height: "0", visibility: "hidden" })),
      transition("expanded <=> collapsed", [animate("0.15s ease-in-out")]),
    ]),
  ],
})
export class CommentsFilterComponent {
  @Input() comments: CommentDisplay[] = []; 
  @Output() filteredComments = new EventEmitter<CommentDisplay[]>();

  @ViewChild("filterSwitcher") filterSwitcherRef!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  protected filters = ["Найновіші", "Найстаріші"];
  protected selectedFilter = signal<string>(this.filters[0]);
  protected filterSwitcherState = signal<string>("collapsed");

  protected isFilterCollapsed = computed<boolean>(() => {
    return this.filterSwitcherState() === "expanded";
  });

  toggleFilterSwitcher() {
    this.filterSwitcherState.set(
      this.filterSwitcherState() === "collapsed" ? "expanded" : "collapsed"
    );
    this.cdr.detectChanges();
  }

  applyFilter(event: Event, filter: string): void {
    event.stopPropagation(); // Зупиняємо подію, щоб вона не викликала toggleFilterSwitcher
    this.selectedFilter.set(filter);
    this.filterSwitcherState.set("collapsed");
    this.filterComments();
  }

  private filterComments(): void {
    let sortedComments = [...this.comments];

    if (this.selectedFilter() === "Найновіші") {
      sortedComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      sortedComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    this.filteredComments.emit(sortedComments);
  }
}
