import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Hub } from "../models/hub.interface";
import { environment } from "../../../../../environment";
import { AuthService } from "../../../core/services/auth.service";
import { HubMemberDto } from "../models/hubMemberDto";
import { CreateHubJoinRequestDto } from "../models/createHubJoinRequestDto";
import { HubJoinRequest } from "../models/hubJoinRequestDto";

@Injectable({ providedIn: 'root' })
export class HubService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    private baseUrl = environment.apiUrl;

    getHubs(): Observable<Hub[]> {
        return this.http.get<Hub[]>(`${this.baseUrl}/hub`);
    }

    getHubById(id: string): Observable<Hub> {
        return this.http.get<Hub>(`${this.baseUrl}/hub/${id}`);
    }

    getAllHubMembers(hubId: string) {
        const params = new HttpParams().set('hubId', hubId);

        return this.http.get<HubMemberDto[]>(`${this.baseUrl}/hub/get-all-hubs-members`, { params });
    }

    isAdmin(hubId: string): Observable<boolean> {
        if (!this.authService.currentUser()?.token) {
            return of(false);
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<boolean>(
            `${this.baseUrl}/hub/is-admin/${hubId}`,
            { headers }
        );
    }

    checkIfUserCanWritePost(hubId: string): Observable<boolean> {
        if (!this.authService.currentUser()?.token) {
            return of(false);
        }
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<boolean>(
            `${this.baseUrl}/hub/check-if-user-can-write-posts/${hubId}`,
            { headers }
        );
    }

    requestJoinHub(request: CreateHubJoinRequestDto): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.post<{ message: string }>(`${this.baseUrl}/hub/request-join`, request, { headers });
    }

    createhub(formData: FormData): Observable<Hub> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.post<Hub>(`${this.baseUrl}/hub/create`, formData, { headers });
    }

    approveRequest(notificationId: string) {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.put(`${this.baseUrl}/hub/approve-request/${notificationId}`, {}, { headers });
    }

    denyRequest(notificationId: string) {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.put(`${this.baseUrl}/hub/deny-request/${notificationId}`, {}, { headers });
    }

    getJoinRequests(hubId: string): Observable<HubJoinRequest[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<HubJoinRequest[]>(`${this.baseUrl}/hub/get-all-hubs-requests/${hubId}`, { headers });
    }

    updateHub(id: string, formData: FormData): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.put<{ message: string }>(
            `${this.baseUrl}/hub/update/${id}`,
            formData,
            { headers }
        );
    }

    deleteHubMember(hubId: string, username: string): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.delete<{ message: string }>(
            `${this.baseUrl}/hub/delete-member/${hubId}/${username}`,
            { headers }
        );
    }
}
