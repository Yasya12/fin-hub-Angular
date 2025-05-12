import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Hub } from "../models/hub.interface";
import { environment } from "../../../../../environment";
import { AuthService } from "../../../core/services/auth.service";
import { HubMemberDto } from "../models/hubMemberDto";
import { CreateHubJoinRequestDto } from "../models/createHubJoinRequestDto";

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

    checkIfUserCanWritePost(hubId: string): Observable<boolean> {
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

    createhub(formData: FormData): Observable<Hub>  {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.post<Hub>(`${this.baseUrl}/hub/create`, formData, { headers });
    }

}
