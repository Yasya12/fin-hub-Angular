import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './ui/header/header.component';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from './ui/side-bar/side-bar.component';
import { ChartsViewComponent } from './ui/charts-view/charts-view.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideBarComponent,
    ChartsViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    SideBarComponent,
    ChartsViewComponent
  ]
})
export class CoreModule { }
