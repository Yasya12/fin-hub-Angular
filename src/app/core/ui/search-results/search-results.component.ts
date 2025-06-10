import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  // Створюємо сигнали для зберігання стану
  searchTerm = signal('');
  results = signal<SearchResult | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      // switchMap автоматично скасує попередній запит, якщо надійде новий
      switchMap(params => {
        const query = params.get('q');
        if (!query) {
          // Якщо запит порожній, не робимо запит до API
          this.isLoading.set(false);
          return of(null);
        }

        this.searchTerm.set(query);
        this.isLoading.set(true);
        this.error.set(null); // Скидаємо помилку перед новим запитом

        return this.searchService.search(query).pipe(
          catchError(err => {
            console.error("Search failed:", err);
            this.error.set('Не вдалося завантажити результати пошуку.');
            return of(null); // Повертаємо null у разі помилки
          })
        );
      })
    ).subscribe(data => {
      this.results.set(data);
      this.isLoading.set(false);
    });
  }

  sanitizeHtmlContent(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
  }
}

