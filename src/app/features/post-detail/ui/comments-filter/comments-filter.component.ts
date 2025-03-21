import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommentFilterService } from '../../services/comment-filter.service';

@Component({
  selector: 'app-comments-filter',
  templateUrl: './comments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("expand-collapse", [
      state("expanded", style({ height: "*", opacity: 1, visibility: "visible" })),
      state("collapsed", style({ height: "0px", opacity: 0, visibility: "hidden" })),
      transition("collapsed => expanded", [
        style({ height: "0px", opacity: 0, visibility: "visible" }),
        animate("0.4s cubic-bezier(0.25, 0.8, 0.25, 1)")
      ]),
      transition("expanded => collapsed", [
        animate("0.3s cubic-bezier(0.65, 0.05, 0.36, 1)", style({ height: "0px", opacity: 0 }))
      ])
    ])
  ]  
})
export class CommentsFilterComponent {
  // Services
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly filterService = inject(CommentFilterService);

  // States
  filters = [
    { label: 'Найновіші', value: 'newest' },
    { label: 'Найстаріші', value: 'oldest' }
  ];
  //protected selectedFilter = signal<string>(this.filters[0]);
  protected filterSwitcherState = signal<string>("collapsed");
  protected isFilterCollapsed = computed<boolean>(() => {
    return this.filterSwitcherState() === "expanded";
  });

  //HTML elements
  @ViewChild("filterSwitcher") filterSwitcherRef!: ElementRef;


  toggleFilterSwitcher() {
    this.filterSwitcherState.set(
      this.filterSwitcherState() === "collapsed" ? "expanded" : "collapsed"
    );
    this.cdr.detectChanges();
  }

  getSelectedFilterLabel(): string {
    const selectedValue = this.filterService.selectedFilter();
    const selectedFilter = this.filters.find(filter => filter.value === selectedValue);
    return selectedFilter ? selectedFilter.label : 'Найновіші'; 
  }
  
  applyFilter(event: Event, filter: string): void {
    event.stopPropagation(); // Зупиняємо подію, щоб вона не викликала toggleFilterSwitcher
    this.filterService.selectedFilter.set(filter);
    this.filterSwitcherState.set("collapsed");
  }
}
