import {Routes} from '@angular/router';

export const dispositivosRoutes: Routes = [

  { path: 'dashboard', loadComponent: () => import('@features/dispositivos/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'lista', loadComponent: () => import('@features/dispositivos/lista/lista.component').then(c => c.ListaComponent) },
  { path: 'activos', loadComponent: () => import('@features/dispositivos/prestamos-activos/prestamos-activos.component').then(c => c.PrestamosActivosComponent)},
  { path: 'historial/:serial', loadComponent: () => import('@features/dispositivos/historial/historial.component').then(c => c.HistorialComponent)},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
