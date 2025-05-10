import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubListComponent } from './hub-list/hub-list.component';
import { HubDetailComponent } from './hub-detail/hub-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HubListComponent
  },
  {
    path: ':id', 
    component: HubDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubsRoutingModule {}
