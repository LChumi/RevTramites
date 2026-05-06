import { Routes } from '@angular/router';
import {importacionesRoutes} from '@features/importaciones/importacionesRoutes';
import {authGuard} from '@guards/auth.guard';
import {LayoutComponent} from '@shared/component/layout/layout.component';
import {BodegasComponent} from '@features/bodegas/bodegas.component';

export const routes: Routes = [
  {
    path: 'icep',
    children: [
      {
        path: 'auth',
        children: [
          {path: 'login', loadComponent: () => import('@features/auth/login/login.component')},
          {path: '', redirectTo: 'login', pathMatch: 'full'},
          {path: '**', redirectTo: 'login', pathMatch:'full'}
        ]
      },
      {
        path: 'tramites', component: LayoutComponent,
        canActivate:[authGuard],
        canActivateChild:[authGuard],
        children: importacionesRoutes
      },
      {
        path: 'bodegas', loadComponent: () => import('@features/bodegas/bodegas.component')
          .then(m => m.BodegasComponent)
      },
      {path: '', redirectTo: 'auth', pathMatch: "full"},
      {path: '**', redirectTo: 'auth', pathMatch: "full"}
    ]
  },
  {path: '', redirectTo: 'icep/auth', pathMatch: "full"},
  {path: '**', redirectTo: 'icep/auth', pathMatch: "full"}
];
