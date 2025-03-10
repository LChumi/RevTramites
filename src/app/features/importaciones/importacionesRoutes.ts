import {Routes} from '@angular/router';

export const importacionesRoutes: Routes = [

  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard/inicio/inicio.component')
  },
  {
    path: 'tramite',
    children: [
      {
        path: 'carga-contenedores',
        loadComponent: () => import('@features/importaciones/tramite/carga-tramite/carga-tramite.component')
      },
      {
        path: 'consultas',
        loadComponent: () => import('@features/importaciones/tramite/consultas-tramite/consultas-tramite.component')
      }
    ]
  },
  {
    path: 'revision',
    children: [
      {
        path: 'contenedor',
        loadComponent: () => import('@features/importaciones/revision/revision-tramite/revision-tramite.component')
      },
      {
        path: 'consultas',
        loadComponent: () => import('@features/importaciones/revision/consultas-revision/consultas-revision.component')
      },
      {
        path: 'validar',
        loadComponent: () => import('@features/importaciones/validar/validacion-tramite/validacion-tramite.component')
      },
    ]
  },
  {
    path: 'muestra',
    children: [
      {
        path: 'envio-muestras',
        loadComponent: () => import('@features/importaciones/muestras/muestra/muestra.component')
      },
      {
        path: 'consultas',
        loadComponent:() => import('@features/importaciones/muestras/consultas-muestras/consultas-muestras.component')
      },
    ]
  },
  {path: '', redirectTo: 'dashboard', pathMatch: "full"},
  {path:'**', redirectTo:'dashboard', pathMatch: "full"}
]
