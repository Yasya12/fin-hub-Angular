import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubListComponent } from './hub-list/hub-list.component';
import { HubsRoutingModule } from './hubs-routing.module';
import { HubDetailComponent } from './hub-detail/hub-detail.component';
import { HubPostsComponent } from './hub-posts/hub-posts.component';
import { FormattedDatePipe } from '../../shared/pipes/FormattedDatePipe';
import { HomeModule } from '../home/home.module';
import { HubPeopleComponent } from './hub-people/hub-people.component';
import { FormsModule } from '@angular/forms';
import { HubJoinRequestComponent } from './hub-join-request/hub-join-request.component';
import { HubEditComponent } from './hub-edit/hub-edit.component';



@NgModule({
  declarations: [
    HubListComponent,
    HubDetailComponent,
    HubPostsComponent,
    HubPeopleComponent,
    HubJoinRequestComponent,
    HubEditComponent
  ],
  imports: [
    CommonModule,
    HubsRoutingModule,
    FormattedDatePipe,
    HomeModule,
    FormsModule
  ]
})
export class HubsModule { }
