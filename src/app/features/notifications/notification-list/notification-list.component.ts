import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthStore } from '../../../core/stores/auth-store';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { NotificationDto } from '../models/notificationDto.model';
import { NotificationService } from '../services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css',
  providers: [AuthStore]
})
export class NotificationListComponent implements OnInit {
  //stores
  authStore = inject(AuthStore)

  //services
  notificationService = inject(NotificationService);
  toastr = inject(ToastrService)

  //states
  currentUser: User | undefined;
  allNotifications = signal<NotificationDto[] | undefined>(undefined);
  selectedFilter = signal<'all' | 'likes' | 'requests' | 'follows'>('all');


  //hooks
  ngOnInit(): void {
    this.loadUser();
    if (this.currentUser) {
      this.loadAllNotification();
    }
  }

  //methods
  onFilterChange(filter: 'all' | 'likes' | 'requests' | 'follows') {
    this.selectedFilter.set(filter);

    switch (filter) {
      case 'all':
        this.loadAllNotification();
        break;
      case 'likes':
        this.loadLikes();
        break;
      case 'requests':
        this.loadRequests();
        break;
      case 'follows':
        this.loadFollows();
        break;
    }
  }

  loadUser() {
    this.currentUser = this.authStore.getCurrentUser();
  }

  loadAllNotification() {
    this.notificationService.getAllNotificationsForUser().subscribe((result) => {
      this.allNotifications.set(result);
    })
  }

  loadLikes(){
     this.notificationService.getLikeNotificationsForUser().subscribe((result) => {
      this.allNotifications.set(result);
    })
  }

  loadRequests(){
    this.notificationService.getRequestNotificationsForUser().subscribe((result) => {
      this.allNotifications.set(result);
    })
  }

  loadFollows(){
    this.notificationService.getFollowNotificationsForUser().subscribe((result) => {
      this.allNotifications.set(result);
    })
  }

  onMarkAsRead(notificationId: string) {
    this.notificationService.markNotificationRead(notificationId);
  }

  onDeleteNotification(notificationId: string) {
    this.notificationService.deleteNotification(notificationId).subscribe(() => {
      const updated = this.allNotifications()?.filter(n => n.id !== notificationId);
      this.allNotifications.set(updated);
      this.toastr.success("Deleted notification")
    });
  }
}
