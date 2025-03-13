import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ToggleLikeResponse } from '../../core/models/Like/toggle-like-response.model';
import { IsLikedResponse } from '../../core/models/Like/is-liked-response.model';
import { environment } from '../../../../environment';


@Injectable({
    providedIn: 'root',
})
export class LikeService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    private getToken(): string {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated');
        }
        return token;
    }

    toggleLike(postId: string): Observable<boolean> {
        const token = this.getToken();

        return this.http.post<ToggleLikeResponse>(`${this.baseUrl}/Like/toggle-like/${postId}`, {}, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        })
            .pipe(
                map((response) => response.success),
                catchError((error) => {
                    //  this.errorHandler.showErrorMessage('Failed to toggle like');
                    return throwError(() => new Error('Failed to toggle like'));
                })
            );
    }

    isPostLiked(postId: string): Observable<boolean> {
        const token = this.getToken();

        return this.http.get<IsLikedResponse>(`${this.baseUrl}/Like/is-liked/${postId}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        })
            .pipe(
                map((response) => response.isLiked),
                catchError((error) => {
                    // this.errorHandler.showErrorMessage('Failed to check like');
                    return throwError(() => new Error('Failed to check like'));
                })
            );
    }
}
