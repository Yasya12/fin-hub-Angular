import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { TimeAgoPipe } from '../../shared/pipes/TimeAgoPipe';
import { NotificationCardComponent } from './notification-card/notification-card.component';



@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationCardComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    TimeAgoPipe
  ]
})
export class NotificationsModule { }
