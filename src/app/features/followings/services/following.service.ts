import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { environment } from "../../../../../environment";
import { Observable, of } from "rxjs";
import { Follow } from "../models/follow.interface";

@Injectable({ providedIn: 'root' })
export class FollowingService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private baseUrl = environment.apiUrl;

    getFollowings(): Observable<Follow[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<Follow[]>(`${this.baseUrl}/following/followings`, { headers });
    }

    getFollowingsForSpecificUser(username: string): Observable<Follow[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<Follow[]>(`${this.baseUrl}/following/followings-for-specific-user/${username}`, { headers });
    }

    getFollowersForSpecificUser(username: string): Observable<Follow[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<Follow[]>(`${this.baseUrl}/following/followers-for-specific-user/${username}`, { headers });
    }

    isFollowingHub(followingHubId: string, type: string = "hub") {
        if (!this.authService.currentUser()?.token) {
            return of(false);
        }
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<boolean>(`${this.baseUrl}/following/is-following`, {
            headers,
            params: { id: followingHubId, type }
        });
    }

    isFollowingUser(followingId: string, type: string = "user") {
        if (!this.authService.currentUser()?.token) {
            return of(false);
        }
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<boolean>(`${this.baseUrl}/following/is-following`, {
            headers,
            params: { id: followingId, type }
        });
    }


    followUser(followingUserId: string): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.post<{ message: string }>(`${this.baseUrl}/following/follow-user?followingId=${followingUserId}`, {}, { headers });
    }

    // followUserByEmail(followingUserEmail: string): Observable<{ message: string }> {
    //     const headers = new HttpHeaders()
    //         .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

    //     return this.http.post<{ message: string }>(`${this.baseUrl}/following/follow-user-by-email?followingEmail=${followingUserEmail}`, {}, { headers });
    // }

    followHub(followingHubId: string): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);
        console.log()

        return this.http.post<{ message: string }>(`${this.baseUrl}/following/follow-hub?followingHubId=${followingHubId}`, {}, { headers });
    }


    unfollow(followingId: string): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.delete<{ message: string }>(`${this.baseUrl}/following/unfollow?followingId=${followingId}`, { headers });
    }
}
