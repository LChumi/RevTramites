import {Routes} from '@angular/router';
import {importacionesRoutes} from '@features/importaciones/importacionesRoutes';
import {authGuard} from '@guards/auth.guard';
import {LayoutComponent} from '@shared/component/layout/layout.component';
import {HomeComponent} from '@features/dashboard/home/home.component';

export const routes: Routes = [
  // Redirige raíz a login
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},

  // Auth (sin layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login/login.component')
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]
  },

  // App protegida (con LayoutComponent)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      // Bodegas al mismo nivel que importaciones
      {
        path: 'bodegas',
        loadComponent: () => import('@features/bodegas/bodegas.component')
      },
      {
        path: 'confiteria',
        loadComponent: () => import('@features/confiteria/confiteria.component')
      },
      {
        path: 'consignacion',
        loadComponent: () => import('@features/consignacion/consignacion.component')
      },
      {
        path: 'observaciones',
        loadComponent: () => import('@features/observacion-producto/observacion-producto.component')
      },
      {
        path:'dashboard', component: HomeComponent
      },
      {
        path:'archivos-reportes',
        loadComponent: () => import('@features/reportes-archivos/reportes-archivos.component')
      },

      // Importaciones
      {
        path: 'tramites',
        children: importacionesRoutes
      },

      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },

  {path: '**', redirectTo: 'auth/login', pathMatch: 'full'}
];
