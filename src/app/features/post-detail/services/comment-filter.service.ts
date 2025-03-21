import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommentFilterService {
    public selectedFilter = signal<string>('newest'); // Default filter
}
