import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPagesComponent } from './info-pages.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { InfoPagesRoutingModule } from './info-pages-routing.module';


@NgModule({
  declarations: [
    InfoPagesComponent,
    AboutPageComponent,
    ContactPageComponent,
    ContactPageComponent
  ],
  imports: [
    CommonModule,
    InfoPagesRoutingModule
  ]
})
export class InfoPagesModule { }
