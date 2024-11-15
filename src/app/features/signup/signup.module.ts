import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import {FormsModule} from "@angular/forms";
import {SignupComponent} from "./signup.component";


@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
  ]
})
export class SignupModule { }
