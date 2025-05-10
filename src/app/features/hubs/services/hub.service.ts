import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Hub } from "../models/hub.interface";
import { environment } from "../../../../../environment";

@Injectable({ providedIn: 'root' })
export class HubService {
    private http = inject(HttpClient);

    private baseUrl = environment.apiUrl;

    getHubs(): Observable<Hub[]> {
        return this.http.get<Hub[]>(`${this.baseUrl}/hub`);
    }

    getHubById(id: string): Observable<Hub> {
        return this.http.get<Hub>(`${this.baseUrl}/hub/${id}`);
    }
}
