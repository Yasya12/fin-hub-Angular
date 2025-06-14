import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { NotificationDto } from '../../models/notificationDto.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service';
import { HubService } from '../../../hubs/services/hub.service';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent implements OnInit {
  //inputs\outputs
  notification = input.required<NotificationDto>();
  @Output() deleteNotification = new EventEmitter<string>();
  @Output() markAsRead = new EventEmitter<string>();

  //services
  router = inject(Router)
  isAdmin: boolean = false;
  private toastr = inject(ToastrService);
  private notificationService = inject(NotificationService);
  hubServices = inject(HubService)

  ngOnInit(): void {
    if (this.notification().hubId) {
      this.hubServices.isAdmin(this.notification().hubId).subscribe((result) => {
        this.isAdmin = result;
      })
    }
  }

  navigateTo(notification: NotificationDto) {
    if (notification.postId) {
      this.markAsRead.emit(notification.id);
      this.router.navigate(['/home/post', notification.postId]);
    }
    if (notification.hubId) {
      this.markAsRead.emit(notification.id);

      //this.router.navigate(['/hubs', notification.hubId], { queryParams: { tab: 'posts' } });
      if (this.isAdmin) {
        this.router.navigate(['/hubs', notification.hubId], { queryParams: { tab: 'requests' } });
      }
      else {
        console.log(this.isAdmin)
        this.router.navigate(['/hubs', notification.hubId]);
      }
    }
    if (notification.type === 'follow') {
      this.markAsRead.emit(notification.id);
      this.router.navigate(['/member', notification.username]);
    }
  }

  // Approve request
  // onApprove(requestId: string, event: Event) {
  //   event.stopPropagation();
  //   this.notificationService.approveRequest(requestId).subscribe({
  //     next: () => {
  //       this.notification().requestStatus = 'Approved';
  //       this.markAsRead.emit(this.notification().id);
  //       this.toastr.success('Request approved!');
  //     },
  //     error: (err) => {
  //       console.error(err)
  //       this.toastr.error('Failed to approve request.');
  //     },
  //   });
  // }

  // // Deny request
  // onDeny(requestId: string, event: Event) {
  //   event.stopPropagation();
  //   this.notificationService.denyRequest(requestId).subscribe({
  //     next: () => {
  //       this.notification().requestStatus = 'Denied';
  //       this.markAsRead.emit(this.notification().id);
  //       this.toastr.warning('Request denied.');
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to deny request.');
  //     },
  //   });
  // }

  // onMarkAsRead(postId: string, event: MouseEvent) {
  //   event.stopPropagation();
  //   this.markAsRead.emit(postId); 
  // }

  onDelete(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deleteNotification.emit(id);
  }
}
