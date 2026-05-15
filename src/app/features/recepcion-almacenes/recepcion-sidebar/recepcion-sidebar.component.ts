import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router} from '@angular/router';
import {MenuModule} from 'primeng/menu';
import {SidebarService} from '@services/state/sidebar.service';

@Component({
  selector: 'app-recepcion-sidebar',
  standalone: true,
  imports: [
    MenuModule
  ],
  templateUrl: './recepcion-sidebar.component.html',
  styleUrl: './recepcion-sidebar.component.scss'
})
export class RecepcionSidebarComponent implements OnInit {

  private router = inject(Router)
  private sidebarService = inject(SidebarService)
  private url: string =''

  private badgeValues: any ={}
  items: MenuItem[]=[];

  constructor() {
    this.url = this.router.url;

    // Escucha cambios de navegación
    this.router.events.subscribe(() => {
      this.url = this.router.url;
    });
  }

  ngOnInit(): void {

    this.sidebarService.badgeValues$.subscribe(values => {
      this.badgeValues = values;
      this.loadSidebar();
    });

    this.loadSidebar();
  }

  loadSidebar() {

    this.items = [
      {
        label: 'Pendientes',
        icon: 'pi pi-clock',
        badge: String(this.badgeValues.pendientes),
        routerLink: '/erp/recepcion-almacenes/pendientes',
        styleClass: this.url.includes('pendientes')
          ? 'active-menu'
          : ''
      },

      {
        label: 'Registrados',
        icon: 'pi pi-file-edit',
        badge: String(this.badgeValues.registrados),
        routerLink: '/erp/recepcion-almacenes/registrados',
        styleClass: this.url.includes('registrados')
          ? 'active-menu'
          : ''
      },

      {
        label: 'Finalizados',
        icon: 'pi pi-check-circle',
        badge: String(this.badgeValues.finalizados),
        routerLink: '/erp/recepcion-almacenes/finalizados',
        styleClass: this.url.includes('finalizado')
          ? 'active-menu'
          : ''
      }
    ];
  }
}
