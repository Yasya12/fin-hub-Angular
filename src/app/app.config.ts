import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations} from "@angular/platform-browser/animations";
import { withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
//import { loadingInterceptor } from './shared/interceptors/loading.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()), //, withInterceptors([loadingInterceptor])
    provideAnimations(), 
    provideToastr(), 
    importProvidersFrom(NgxSpinnerModule),
  ]
};
