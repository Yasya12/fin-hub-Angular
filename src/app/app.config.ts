import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Додаємо provideHttpClient

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(), // Додаємо HttpClient як провайдер
    provideAnimations()
  ]
};
