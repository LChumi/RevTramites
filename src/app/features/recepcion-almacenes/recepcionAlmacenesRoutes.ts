import {Routes} from '@angular/router';

export const recepcionAlmacenesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/recepcion-almacenes/recepcion-almacenes.component'),
    children:[
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'pendientes',
        loadComponent: () =>
          import('@features/recepcion-almacenes/recepcion-pendientes/recepcion-pendientes.component')
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/recepcion-almacenes/recepcepcion-dashboard/recepcepcion-dashboard.component')
      },
      {
        path: 'registrados',
        children:[
          {
            path: '',
            loadComponent: () =>
              import('@features/recepcion-almacenes/recepcion-registrados/recepcion-registrados.component')
          },
          {
            path: 'scaneo/:id',
            loadComponent: () =>
              import('@features/recepcion-almacenes/recepcion-scaneo/recepcion-scaneo.component')
          }
        ]
      },

      {
        path: 'finalizados',
        loadComponent: () =>
          import('@features/recepcion-almacenes/recepcion-finalizados/recepcion-finalizados.component')
      }
    ]
  },
]
