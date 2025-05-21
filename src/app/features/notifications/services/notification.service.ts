import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";

import { Observable, of } from "rxjs";
import { environment } from "../../../../../environment";

import { AuthService } from "../../../core/services/auth.service";
import { NotificationDto } from "../models/notificationDto.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private baseUrl = environment.apiUrl;

    // Сигнал для зберігання сповіщень
    notifications = signal<NotificationDto[]>([]);
    unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

    constructor() {
        this.loadNotifications();
    }

    loadNotifications(): void {
        if (!this.authService.currentUser()?.token) {
            return;
        }

        this.authService.setCurerntUser();
        this.getAllNotificationsForUser().subscribe((data) => {
            this.notifications.set(data);
        });
    }

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
        ).subscribe(() => {
            // Оновлюємо локальний список сповіщень
            const updatedNotifications = this.notifications().map(noti =>
                noti.id === notiId ? { ...noti, isRead: true } : noti
            );
            this.notifications.set(updatedNotifications);
        });
    }


    deleteNotification(notiId: string) {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.delete(
            `${this.baseUrl}/notification/${notiId}`,
            { headers }
        );
    }
}
