import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPagesComponent } from './info-pages.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { InfoPagesRoutingModule } from './info-pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';


@NgModule({
  declarations: [
    InfoPagesComponent,
    AboutPageComponent,
    ContactPageComponent,
    ContactPageComponent,
    PrivacyComponent,
    TermsComponent
  ],
  imports: [
    CommonModule,
    InfoPagesRoutingModule,
    ReactiveFormsModule
  ]
})
export class InfoPagesModule { }
