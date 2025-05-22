import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { preventUnsavedChangesGuard } from '../../shared/guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './resolvers/member-detailed.resolver';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { MemberEditComponent } from './member-edit/member-edit.component';

const routes: Routes = [
  {
    path: 'edit',
    component: MemberEditComponent,
    canDeactivate: [preventUnsavedChangesGuard]
  },
  {
    path: ':username',
    component: MemberProfileComponent,
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
