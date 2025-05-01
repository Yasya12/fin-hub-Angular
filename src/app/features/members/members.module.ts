import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MembersRoutingModule } from './members-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MemberEditComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule
  ]
})
export class MembersModule { }
