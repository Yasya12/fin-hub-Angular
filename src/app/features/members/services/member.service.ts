import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../../../core/models/interfaces/user/user.interface";
import { AuthService } from "../../../core/services/auth.service";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    //Services
    private readonly http = inject(HttpClient);
    private authService = inject(AuthService);

    //States
    private baseUrl = environment.apiUrl;

    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/user/by-username/${username}`);
    }

    updateMember(user: User) {
        return this.http.put<User>(`${this.baseUrl}/user`, user, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        });
    }

    addPhoto(formData: FormData): Observable<HttpResponse<string>> {
        return this.http.post<string>(`${this.baseUrl}/user/add-photo`, formData, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`),
            observe: 'response'
        });
    }

    deletePhoto() {
        return this.http.delete(`${this.baseUrl}/user/delete-photo`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        });
    }
}
