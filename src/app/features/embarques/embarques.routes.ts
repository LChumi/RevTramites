import {Routes} from '@angular/router';

export const embarquesRoutes: Routes = [
  {path: 'dashboard', loadComponent: () => import('@features/embarques/dasboard/dasboard.component')},
  {path: 'referencias', loadComponent: () => import('@features/embarques/referencia/puerto-consignatario/puerto-consignatario.component')},

];
