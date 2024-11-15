import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TryComponent } from './try.component';
import {TryRoutingModule} from "./try-routing.module";



@NgModule({
  declarations: [
    TryComponent
  ],
  imports: [
    CommonModule,
    TryRoutingModule
  ]
})
export class TryModule { }
