import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../shared/models/interfaces/pagination.model';
import { Message } from '../models/message.model';
import { response } from 'express';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    //Services
    private readonly http = inject(HttpClient);

    //States
    private baseUrl = environment.apiUrl;
    paginatedResult = signal<PaginatedResult<Message[]> | undefined>(undefined);

    getMessages(pageNumber: number, pageSize: number, username: string, container: string) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('username', username)
            .set('Container', container); // <- use .set, and chain it

        return this.http.get<Message[]>(`${this.baseUrl}/message`, {
            observe: 'response', params, headers: { 'Cache-Control': 'no-cache' },
            transferCache: { includeHeaders: ['Pagination'] }
        }).pipe(
            tap(response => {
                const paginationHeader = response.headers.get('Pagination');
                this.paginatedResult.set({
                    items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
                    pagination: JSON.parse(paginationHeader!),
                });
            }
            )
        )
    }
}
