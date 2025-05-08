import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from '../../shared/guards/prevent-unsaved-changes.guard';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { memberDetailedResolver } from './resolvers/member-detailed.resolver';

const routes: Routes = [
  {
    path: 'edit',
    component: MemberEditComponent,
    canDeactivate: [preventUnsavedChangesGuard]
  },
  {
    path: ':username',
    component: MemberDetailComponent,
    resolve: {
      user: memberDetailedResolver
    },
    canDeactivate: [preventUnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
