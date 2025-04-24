import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from '../../shared/guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  {
    path: 'edit',
    component: MemberEditComponent,
    canDeactivate: [preventUnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule {}
