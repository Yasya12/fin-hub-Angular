import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubListComponent } from './hub-list/hub-list.component';
import { HubsRoutingModule } from './hubs-routing.module';
import { HubDetailComponent } from './hub-detail/hub-detail.component';
import { HubPostsComponent } from './hub-posts/hub-posts.component';
import { FormattedDatePipe } from '../../shared/pipes/FormattedDatePipe';
import { CreatePostComponent } from '../home/ui/create-post/create-post.component';
import { HomeModule } from '../home/home.module';



@NgModule({
  declarations: [
    HubListComponent,
    HubDetailComponent,
    HubPostsComponent
  ],
  imports: [
    CommonModule,
    HubsRoutingModule,
    FormattedDatePipe,
    HomeModule
  ]
})
export class HubsModule { }
