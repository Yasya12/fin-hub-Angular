import { Routes } from '@angular/router';
import {TryComponent} from "./features/try/try.component";

export const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'try',
    loadChildren: () => import('./features/try/try.module').then(m => m.TryModule)
  }
];
