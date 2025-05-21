import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowingListComponent } from './following-list/following-list.component';

const routes: Routes = [
  {
    path: '',
    component: FollowingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowingsRoutingModule {}
