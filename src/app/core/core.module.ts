import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './ui/header/header.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ApartAsideComponent } from './ui/apart-aside/apart-aside.component';
import { ChartsViewComponent } from '../shared/ui/charts-view/charts-view.component';
import { TickerTapeComponent } from './ui/ticker-tape/ticker-tape.component';
import { HomeModule } from "../features/home/home.module";

@NgModule({
  declarations: [
    HeaderComponent,
    ApartAsideComponent,
    TickerTapeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsViewComponent,
    TooltipModule.forRoot(),
    HomeModule
],
  exports: [
    HeaderComponent,
    ApartAsideComponent,
    TickerTapeComponent
  ]
})
export class CoreModule { }
