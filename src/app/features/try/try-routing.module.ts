import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TryComponent} from "./try.component";

const routes: Routes = [
  {path: '', component: TryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TryRoutingModule { }
