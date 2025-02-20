import { Routes } from '@angular/router';
import {importacionesRoutes} from '@features/importaciones/importacionesRoutes';

export const routes: Routes = [
  {
    path: 'icep',
    children: [
      {
        path: 'auth',
        children: [
          {path: 'login', loadComponent: () => import('@features/auth/login/login.component')}
        ]
      },
      {
        path: 'bodega-recepcion',
        children: importacionesRoutes
      }
    ]
  },
  {path: '', redirectTo: 'icep', pathMatch: "full"},
  {path: '**', redirectTo: 'icep', pathMatch: "full"}
];
