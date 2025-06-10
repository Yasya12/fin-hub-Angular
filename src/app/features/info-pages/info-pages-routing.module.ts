import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AboutPageComponent } from './about-page/about-page.component';
import { InfoPagesComponent } from './info-pages.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    component: InfoPagesComponent,
    children: [
      { path: 'about', component: AboutPageComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'terms', component: TermsComponent },
      { path: '', redirectTo: 'about', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoPagesRoutingModule { }
