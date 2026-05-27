import {Routes} from '@angular/router';
import {importacionesRoutes} from '@features/importaciones/importacionesRoutes';
import {authGuard} from '@guards/auth.guard';
import {LayoutComponent} from '@shared/component/layout/layout.component';
import {HomeComponent} from '@features/dashboard/home/home.component';
import LoginComponent from '@features/auth/login/login.component';
import {recepcionAlmacenesRoutes} from '@features/recepcion-almacenes/recepcionAlmacenesRoutes';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    component: LoginComponent
  },

  {
    path: 'erp',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'bodegas', loadComponent: () => import('@features/bodegas/bodegas.component') },
      { path: 'confiteria', children: [
          {path: '', loadComponent: () => import('@features/confiteria/confiteria.component')},
          {path: 'consulta', loadComponent: () => import('@features/confiteria/pedidos-generados/pedidos-generados.component')}
        ] },
      { path: 'consignacion', loadComponent: () => import('@features/consignacion/consignacion.component') },
      { path: 'observaciones', loadComponent: () => import('@features/observacion-producto/observacion-producto.component') },
      { path: 'archivos-reportes', loadComponent: () => import('@features/reportes-archivos/reportes-archivos.component') },
      {path: 'recepcion-almacenes', children: recepcionAlmacenesRoutes},
      { path: 'tramites', children: importacionesRoutes },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },

  { path: '**', redirectTo: 'auth' }
];
