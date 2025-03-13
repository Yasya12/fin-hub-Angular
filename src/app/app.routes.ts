import { Routes } from '@angular/router';
import { UnderDevelopmentComponent } from './shared/ui/under-development/under-development.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'signup',
    loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'under-development',
    component: UnderDevelopmentComponent
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'post-detail/:id',
    loadChildren: () => import('./features/post-detail/post-detail.module').then(m => m.PostDetailModule)
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
