import {Routes} from '@angular/router';

export const embarquesRoutes: Routes = [
  {path: 'dashboard', loadComponent: () => import('@features/embarques/dasboard/dasboard.component')},
  {
    path: 'referencias',
    loadComponent: () => import('@features/embarques/referencia/puerto-consignatario/puerto-consignatario.component')
  },
  {
    path: 'cotizaciones',
    loadComponent: () => import('@features/embarques/cotizaciones/proceso-list/proceso-list.component')
  },
  {
    path: 'cotizaciones/:id',
    loadComponent: () => import('@features/embarques/cotizaciones/proceso-detalle/proceso-detalle.component')
  },
  {
    path: 'tramites',
    loadComponent: () => import('@features/embarques/tramites/lista-tramites/lista-tramites.component')
  },
  {
    path: 'tramites/:id',
    loadComponent: () => import('@features/embarques/tramites/tramite-detalle/tramite-detalle.component')
  }
];
