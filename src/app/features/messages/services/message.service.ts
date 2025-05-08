import { Inject, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../shared/models/interfaces/pagination.model';
import { Message } from '../models/message.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    //Services
    private readonly platformId = inject(PLATFORM_ID);
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);

    //States
    private baseUrl = environment.apiUrl;
    paginatedResult = signal<PaginatedResult<Message[]> | undefined>(undefined);
    paginatedThreadMessages = signal<PaginatedResult<Message[]> | undefined>(undefined);

    getMessages(pageNumber: number, pageSize: number, username: string, container: string) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('username', username)
            .set('Container', container); 

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
            .set('Cache-Control', 'no-cache');

        return this.http.get<Message[]>(`${this.baseUrl}/message`, {
            observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
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

    getMessageThread(username: string, pageNumber: number, pageSize: number): Observable<HttpResponse<Message[]>> {
        if (!isPlatformBrowser(this.platformId)) {
            // Prevent SSR from calling this
            return of(new HttpResponse<Message[]>({
                body: [],
                headers: new HttpHeaders(),
                status: 200,
                statusText: 'OK',
                url: `${this.baseUrl}/message/thread/${username}`
            }));
        }

        const user = this.authService.currentUser();
        if (!user?.token) {
            return throwError(() => new Error('Token is undefined'));
        }

        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${user.token}`)
            .set('Cache-Control', 'no-cache');

        return this.http.get<Message[]>(`${this.baseUrl}/message/thread/${username}`, {
            observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
        }).pipe(
            tap(response => {
                const paginationHeader = response.headers.get('Pagination');
                this.paginatedThreadMessages.set({
                    items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
                    pagination: JSON.parse(paginationHeader!),
                });
            }
            )
        );
    }

    sendMessage(username: string, content: string) {
        return this.http.post<Message>(`${this.baseUrl}/message`, { recipientUsername: username, content }, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        }).pipe(
            catchError((error) => {
                console.error('Error sending message:', error);
                return throwError(() => error);
            })
        );
    }

    deleteMessage(id: string) {
        return this.http.delete(`${this.baseUrl}/message/${id}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        }).pipe(
            catchError((error) => {
                console.error('Error deleting message:', error);
                return throwError(() => error);
            })
        );
    }
}
