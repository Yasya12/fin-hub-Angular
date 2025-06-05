import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { UnderDevelopmentComponent } from './shared/ui/under-development/under-development.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
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
        path: 'messages',
        loadChildren: () => import('./features/messages/messages.module').then(m => m.MessagesModule)
      },
      {
        path: 'member',
        loadChildren: () => import('./features/members/members.module').then(m => m.MembersModule)
      },
      {
        path: 'hubs',
        loadChildren: () => import('./features/hubs/hubs.module').then(m => m.HubsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'followings',
        loadChildren: () => import('./features/followings/followings.module').then(m => m.FollowingsModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'info',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/info-pages/info-pages.module').then(m => m.InfoPagesModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
