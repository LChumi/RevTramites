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
          import('@features/recepcion-almacenes/recepcion-dashboard/recepcion-dashboard.component')
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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@features/recepcion-almacenes/recepcion-finalizados/recepcion-finalizados.component')
          },
          {
            path:'editar/:id',
            loadComponent: () =>
              import('@features/recepcion-almacenes/recepcion-finalizados/components/revision-edit/revision-edit.component')
          }
        ]
      }
    ]
  },
]
