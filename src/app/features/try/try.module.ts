import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TryComponent } from './try.component';
import {TryRoutingModule} from "./try-routing.module";
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    TryComponent
  ],
  imports: [
    CommonModule,
    TryRoutingModule,
    FormsModule 
  ]
})
export class TryModule { }
