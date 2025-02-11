import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signup',
        loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'try',
        loadChildren: () => import('./features/try/try.module').then(m => m.TryModule)
      },
      {
        path: 'post-detail/:id',
        loadChildren: () => import('./features/post-detail/post-detail.module').then(m => m.PostDetailModule)
      }
    ]
  },
];
