import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommentFilterService {
    private selectedFilter = signal<string>('newest'); // Default filter

    // Getters
    getFilter() {
        return this.selectedFilter();
    }
    // Setters
    setFilter(filter: string) {
        this.selectedFilter.set(filter);
    }
}
