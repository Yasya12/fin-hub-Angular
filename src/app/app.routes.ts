import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/layouts/auth-layout/auth-layout.component';
import { UnderDevelopmentComponent } from './shared/ui/under-development/under-development.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // Запобігає неправильному матчінгу
    redirectTo: 'home', 
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signup',
        loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule)
      },
      {
        path: 'under-development',  
        component: UnderDevelopmentComponent 
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
        path: 'post-detail/:id',
        loadChildren: () => import('./features/post-detail/post-detail.module').then(m => m.PostDetailModule)
      }
    ]
  },
  {
    path: '**', // Обробка невідомих маршрутів
    redirectTo: 'home',
  }
];
