import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ToggleLikeResponse } from '../../core/models/interfaces/like/toggle-like-response.interface';
import { IsLikedResponse } from '../../core/models/interfaces/like/is-liked-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LikeService {
    //Services
    private readonly http = inject(HttpClient);

    //States
    private _baseUrl = environment.apiUrl;
    public get baseUrl() {
        return this._baseUrl;
    }
    public set baseUrl(value) {
        this._baseUrl = value;
    }

    private getToken(): string {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated');
        }
        return token;
    }

    toggleLike(postId: string): Observable<boolean> {
        const token = this.getToken();

        if (!token) {
            return throwError(() => new Error('Authentication token is missing.'));
        }

        if (!postId) {
            return throwError(() => new Error('Invalid postId.'));
        }

        const url = `${this.baseUrl}/Like/toggle-like/${postId}`;

        return this.http.post<ToggleLikeResponse>(url, {}, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        }).pipe(
            map((response) => response.success),
            catchError(() => throwError(() => new Error('Failed to toggle like')))
        );
    }

    isPostLiked(postId: string): Observable<boolean> {
        const token = this.getToken();

        return this.http.get<IsLikedResponse>(`${this.baseUrl}/Like/is-liked/${postId}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        }).pipe(
            map((response) => response.isLiked),
            catchError(() => throwError(() => new Error('Failed to check like')))
        );
    }
}
