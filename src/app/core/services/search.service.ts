import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/interfaces/user/user.interface';
import { Hub } from '../../features/hubs/models/hub.interface';
import { Post } from '../../features/home/models/post.interface';

export interface SearchResult {
  users: User[];
  hubs: Hub[];
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  search(query: string): Observable<SearchResult> {
    // Створюємо параметри запиту, напр. /api/search?q=test
    const params = new HttpParams().set('q', query);
    
    // Робимо GET-запит і очікуємо відповідь типу SearchResult
    return this.http.get<SearchResult>(`${this.baseUrl}/search`, { params });
  }
}