import { Routes } from '@angular/router';
import {importacionesRoutes} from '@features/importaciones/importacionesRoutes';
import {authGuard} from './core/guards/auth.guard';

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
        path: 'bodega-recepcion',
        canActivate:[authGuard],
        children: importacionesRoutes
      }
    ]
  },
  {path: '', redirectTo: 'icep/auth', pathMatch: "full"},
  {path: '**', redirectTo: 'icep/auth', pathMatch: "full"}
];
