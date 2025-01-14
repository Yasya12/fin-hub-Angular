import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'try',
    loadChildren: () => import('./features/try/try.module').then(m => m.TryModule)
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
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];
