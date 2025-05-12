import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubListComponent } from './hub-list/hub-list.component';
import { HubsRoutingModule } from './hubs-routing.module';
import { HubDetailComponent } from './hub-detail/hub-detail.component';
import { HubPostsComponent } from './hub-posts/hub-posts.component';
import { FormattedDatePipe } from '../../shared/pipes/FormattedDatePipe';
import { CreatePostComponent } from '../home/ui/create-post/create-post.component';
import { HomeModule } from '../home/home.module';
import { HubPeopleComponent } from './hub-people/hub-people.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HubListComponent,
    HubDetailComponent,
    HubPostsComponent,
    HubPeopleComponent
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
