import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../environment";
import { User } from "../../../core/models/interfaces/user/user.interface";
import { AuthService } from "../../../core/services/auth.service";

@Injectable({
    providedIn: 'root',
})
export class MemberService {
    //Services
    private readonly http = inject(HttpClient);
    private authService = inject(AuthService);

    //States
    private baseUrl = environment.apiUrl;

    updateMember(user: User) {
        return this.http.put<User>(`${this.baseUrl}/user`, user, {
                    headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
                });
    }
}
