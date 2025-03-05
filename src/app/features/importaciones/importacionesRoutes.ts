import {Routes} from '@angular/router';

export const importacionesRoutes: Routes = [
  {
    path: 'carga-bultos',
    loadComponent: () => import('@features/importaciones/carga-tramite/carga-tramite.component')
  },
  {
    path: 'revision-bultos',
    loadComponent: () => import('@features/importaciones/revision-tramite/revision-tramite.component')
  },
  {
    path: 'muestras',
    loadComponent: () => import('@features/importaciones/muestra/muestra.component')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard/inicio/inicio.component')
  },
  {path: '', redirectTo: 'dashboard', pathMatch: "full"},
  {path:'**', redirectTo:'dashboard', pathMatch: "full"}
]
