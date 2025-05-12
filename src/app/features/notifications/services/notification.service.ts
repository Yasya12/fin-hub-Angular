import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../environment";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationDto } from "../models/notificationDto.model";

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private baseUrl = environment.apiUrl;

    getAllNotificationsForUser(): Observable<NotificationDto[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);


        return this.http.get<NotificationDto[]>(`${this.baseUrl}/notification`, { headers });
    }

    getLikeNotificationsForUser(): Observable<NotificationDto[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);


        return this.http.get<NotificationDto[]>(`${this.baseUrl}/notification/likes-noti`, { headers });
    }

    getRequestNotificationsForUser(): Observable<NotificationDto[]> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);


        return this.http.get<NotificationDto[]>(`${this.baseUrl}/notification/request-noti`, { headers });
    }

    markNotificationRead(notiId: string) {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.put(
            `${this.baseUrl}/notification/${notiId}/mark-read`,
            null,
            { headers }
        );
    }

    deleteNotification(notiId: string) {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.delete(
            `${this.baseUrl}/notification/${notiId}`,
            { headers }
        );
    }


    //its need to be in hub service
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
}
