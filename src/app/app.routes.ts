import { Routes } from '@angular/router';
import * as path from 'node:path';

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
    ]
  }
];
